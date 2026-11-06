# GASPOL Precision Executive Design System

## Brand direction

GASPOL is presented as an executive automotive-finance workspace: precise,
confident, and operational. The interface should feel closer to a premium
vehicle instrument panel and an enterprise finance console than a generic SaaS
dashboard.

Core principles:

- Prioritize financial figures and operational actions over decoration.
- Use asymmetry, fine rules, and restrained contrast to create character.
- Use shadows only to establish meaningful elevation.
- Keep motion short and functional.
- Preserve the existing GASPOL and Setir Kanan brand assets.

## Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| Ink | `#081B2E` | Primary text, dark actions, navigation |
| Midnight | `#0A2746` | Premium dark surfaces |
| Cobalt | `#005FAF` | Primary interaction and focus |
| Cyan | `#46B8D8` | Brand accent and active indicators |
| Teal | `#4CB8B0` | Secondary brand accent |
| Bone | `#F3F1EB` | Application canvas |
| Paper | `#FFFEFB` | Main surfaces |
| Mist | `#E8EDF0` | Dividers and subdued surfaces |
| Slate | `#607181` | Secondary text |
| Amber | `#C47A2C` | Important financial highlight |
| Positive | `#188267` | Success and completed state |
| Critical | `#C34C4C` | Error, reject, and destructive action |

All normal-sized text and interactive controls must target WCAG AA contrast.

## Typography

- Primary interface: Plus Jakarta Sans, weights 400-800.
- Financial figures and compact display labels: Barlow Condensed, weights
  500-700.
- Numeric values should use tabular numerals.
- Headings use sentence case. Uppercase is reserved for small operational
  kickers and table labels.

## Shape and elevation

- Page shells: 24px radius with one tighter corner for controlled asymmetry.
- Form sections: 18px radius.
- Controls: 12px radius.
- Status chips: compact pill only when the content is truly a status.
- Use a single soft panel shadow; tables and nested groups rely on hairline
  borders rather than repeated shadows.

## Responsive behavior

### Desktop (1024px and above)

- Persistent top navigation.
- Simulation uses a 5/7 input-result layout with the result remaining sticky.
- History uses a full data table with a dedicated action/status structure.
- Login uses an asymmetric two-panel composition.

### Tablet (768px-1023px)

- Content becomes single-column where required.
- Navigation remains compact and touch-friendly.
- Tables can scroll horizontally without compressing labels.

### Mobile (below 768px)

- Compact brand top bar and persistent bottom navigation.
- Forms and results stack in task order.
- Important figures remain visible before detailed breakdowns.
- History switches from table rows to purpose-built cards.
- Touch targets should be at least 44px high.

## Interaction rules

- Focus uses a visible cobalt ring with an external paper-colored offset.
- Hover should clarify action, not move large surfaces.
- Pressed buttons may translate by 1px; avoid springy or decorative motion.
- Loading, success, error, upload, and destructive states retain their existing
  behavior and only receive visual styling.

## Logic boundary

The visual system must not modify calculations, rate selection, authentication,
demo fallback behavior, uploads, persistence, API calls, routes, or role-based
permissions. Presentational wrappers and styling are allowed; functional state
and handlers remain unchanged.
