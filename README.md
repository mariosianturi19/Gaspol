# GASPOL

A vehicle credit simulation tool for a car dealership sales team. A salesperson
enters the unit and the credit parameters, and the app resolves the applicable
interest and insurance rates from the rate tables, computes the full instalment
breakdown, and saves the result with the supporting customer documents attached.

**[Live demo](https://www.gaspol.web.id)**

## Screenshots

_Screenshots of the simulation form, the result breakdown, the budget solver, and
the history table will be added here._

## Tech stack

| Component | Note |
|---|---|
| Next.js 16 (App Router) | React 19, TypeScript |
| Prisma 6 | MySQL via the MariaDB adapter |
| jose | Session tokens, HS256, httpOnly cookie |
| bcryptjs | Password hashing, cost factor 12 |
| Tailwind CSS 4 | Styling |
| next-pwa | Installable, offline asset caching |

## What it actually computes

Two inputs decide almost everything: the vehicle price and the down payment
percentage.

**The down payment sets a star level, and the star level sets the interest rate.**
DP thresholds map to stars 1 through 7 (5%, 10%, 15%, 20%, 25%, 30%). The star then
forms part of the lookup key into the interest rate table, alongside vehicle
category, payment type, and tenor. So moving the DP slider does not simply change
the principal, it can move the customer into a different rate band entirely.

**Insurance rates come from a table keyed by five fields.** Category, sub category,
whether the unit is a loading vehicle, tenor in years, and the price band the
vehicle falls into. Matching options are sorted cheapest first and the cheapest is
selected by default, so a salesperson does not have to memorise the rate card.

**The instalment chain.** Principal, plus insurance, plus policy fee, gives the
total AR. Interest is that total multiplied by the rate and the tenor in years.
Total loan is AR plus interest, and the monthly instalment is total loan divided by
tenor. Rounding follows the finance convention rather than plain arithmetic:
interest rounds to the nearest 100, and the monthly instalment rounds *up* to the
nearest 10,000, because a dealer quotes a round figure and absorbs the remainder.

**Payment type changes what is due at signing.** Under `ADDM` the first instalment
is collected upfront and added to the total down payment; under `ADDB` it is not.

**Star level 1 is a different calculation, not a special case of the same one.** At
the lowest DP band the loan is written against the full vehicle price with no down
payment, insurance is calculated on the price plus 2,000,000 using a separate
regional rate table, the amount due at signing becomes two instalments plus fees,
and the instalment divisor drops to tenor minus two. It shares little with the
normal path beyond the variable names.

## Design decisions worth a look

**The budget solver is a binary search.** Sales conversations usually run backwards:
the customer names a monthly payment they can afford, and the salesperson has to
find a down payment that lands there. There is no closed form for this, because the
DP feeds the star level, which changes the interest rate, which changes the
instalment. So the solver treats it as a search problem: bisect the DP between 5%
and 90%, recompute the full model at each midpoint, and keep the candidate whose
result sits closest to the target. Sixty iterations converge well past the
precision that matters for currency. It solves for either target, total down
payment or monthly instalment, and the comparison flips direction between the two,
because a higher DP raises one and lowers the other.

**Attachments are compressed in the browser before upload.** Photographs of
identity documents come off a phone camera at several megabytes. The client draws
each image to a canvas, scales it to 1024px on the long edge, re-encodes it as JPEG
at quality 0.6, and only then converts it to base64. Three size guards sit around
that: 15MB per input file, 3MB for PDFs, which are passed through rather than
compressed, and 4.5MB for the total serialised payload, which is the limit that
actually matters because it is the request body ceiling on the deployment target.

**Sessions are verified in two places, for two different jobs.** The middleware
guards page routes and redirects an unauthenticated visitor to the login screen.
The API routes verify the session themselves and answer with a 401, because a
client expecting JSON should not be handed an HTML login page. Role checks for the
destructive operations, updating a status and deleting a record, live in the route
handler rather than the middleware, since the middleware has no reason to know
about roles.

**Ownership is taken from the session, never the request body.** A caller cannot
file a simulation under another user account by editing the payload.

**Known weakness: the session key has a hard-coded fallback.** When
`JWT_SECRET` is unset, `lib/auth.ts` and `middleware.ts` fall back to a literal
string that is visible in this repository, so a deployment that omits the
variable signs its cookies with a publicly known key. Setting `JWT_SECRET` in the
hosting environment closes that gap. Removing the fallback entirely would be the
stronger fix, at the cost of the app refusing to start when the variable is
missing.

## Data model

| Model | Purpose |
|---|---|
| `User` | Login and role. `SALES` creates simulations, `PROSESOR` can update status and delete |
| `InterestRate` | Rate by category, payment type, star level, tenor |
| `InsuranceRate` | Rate by category, tenor, and price band, with a display label |
| `StarConfig` | Minimum down payment per star level |
| `Simulation` | Customer, unit, credit parameters, every computed figure, and attachments |

Computed figures are stored rather than recalculated on read. A saved simulation is
a quote that was given to a customer, so it has to keep showing the numbers that
were quoted even after the rate tables change.

## API

| Method | Path | Auth |
|---|---|---|
| `POST` | `/api/auth/login` | Public |
| `POST` | `/api/auth/logout` | Public |
| `GET` | `/api/auth/me` | Public, returns `null` when signed out |
| `GET` | `/api/rates` | Public, rate cards only |
| `GET` | `/api/simulation` | Session required |
| `POST` | `/api/simulation` | Session required |
| `PATCH` | `/api/simulation/[id]` | `PROSESOR` only |
| `DELETE` | `/api/simulation/[id]` | `PROSESOR` only |

## Running it

**Prerequisites:** Node 20 or newer and a MySQL database.

1. **Configure.** Copy `.env.example` to `.env` and set `DATABASE_URL`.

   Also set `JWT_SECRET` to a random value. The app starts without it, but
   falls back to a key that is published in this repository. Generate one with
   `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.

2. **Install and prepare the schema.**

   ```bash
   npm install
   npx prisma migrate deploy
   ```

3. **Seed the accounts.** Creates one `PROSESOR` and one `SALES` account.
   Edit the credentials at the top of `prisma/seed.ts` before running it against
   anything real; the committed values are placeholders.

   ```bash
   npx prisma db seed
   ```

4. **Run.**

   ```bash
   npm run dev
   ```

   Open <http://localhost:3000>.

Rate tables are not seeded. Populate `InterestRate`, `InsuranceRate`, and
`StarConfig` with the rate card you are working from, otherwise the calculator
falls back to a default interest rate and offers no insurance options.

## Notes and limitations

- **The regional insurance rates used by the star level 1 path are hard-coded** in
  the calculation hook, while every other rate comes from the database. That is an
  inconsistency worth resolving by moving them into `InsuranceRate` under their own
  category.
- **The history view returns every simulation** to any signed-in user. For a shared
  sales team that is the intended behaviour; if per-salesperson visibility is wanted
  later, `Simulation.userId` is already populated and the query only needs a filter.
- **Attachments are stored as base64 in a `LONGTEXT` column.** It keeps the
  deployment to a single database with no object storage, at the cost of row size
  and the payload ceiling described above. Object storage with signed URLs would be
  the next step if volume grows.
- **No automated tests yet.** The calculation logic is the part that most warrants
  them, since it is pure and straightforward to cover.
