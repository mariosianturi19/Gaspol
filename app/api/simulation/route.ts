// app/api/simulation/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Simulations hold customer names and uploaded identity documents, so both
 * handlers below require a session. The route matcher in middleware.ts only
 * covers page routes; API routes verify the session themselves and answer with
 * a 401 rather than a redirect, because a client fetching JSON should not be
 * handed a login page.
 */
async function requireSession() {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 }),
    };
  }
  return { session, response: null };
}

/** Numbers arrive from JSON and may be strings, null, or absent. */
function num(value: unknown, fallback: number | null = null): number | null {
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  try {
    const body = await request.json();

    // Reject early rather than letting Prisma throw on a null column: the
    // client should get a 400 it can act on, not a generic 500.
    const vehiclePrice = num(body.price);
    const dpPercent = num(body.dpPercent);
    const tenor = num(body.tenor);

    if (!body.borrowerName || !body.unitName) {
      return NextResponse.json(
        { error: 'Nama nasabah dan nama unit wajib diisi.' },
        { status: 400 },
      );
    }
    if (vehiclePrice === null || vehiclePrice <= 0) {
      return NextResponse.json({ error: 'Harga unit tidak valid.' }, { status: 400 });
    }
    if (dpPercent === null || dpPercent < 0 || dpPercent > 100) {
      return NextResponse.json({ error: 'Persentase DP tidak valid.' }, { status: 400 });
    }
    if (tenor === null || tenor <= 0) {
      return NextResponse.json({ error: 'Tenor tidak valid.' }, { status: 400 });
    }

    const savedSimulation = await prisma.simulation.create({
      data: {
        // Ownership comes from the session, never from the request body, so a
        // caller cannot file a simulation under someone else's account.
        userId: Number((session as { id?: number }).id) || null,

        borrowerName: body.borrowerName,
        coBorrowerName: body.coBorrowerName,
        salesName: body.salesName,
        status: body.status,
        attachments: body.attachments,

        unitName: body.unitName,
        nopol: body.nopol,
        category: body.category,
        subCategory: body.subCategory,
        isLoadingUnit: Boolean(body.isLoadingUnit),
        vehiclePrice,
        dpPercent,
        tenor,
        paymentType: body.paymentType,
        adminFee: num(body.adminFee, 0) as number,
        insuranceLabel: body.selectedInsuranceLabel,

        dpAmount: num(body.dpAmount, 0) as number,
        monthlyPayment: num(body.monthlyPayment, 0) as number,
        totalFirstPay: num(body.totalFirstPay, 0) as number,
        interestRate: num(body.interestRate),
        insuranceRate: num(body.insuranceRate),
        insuranceAmount: num(body.insuranceAmount),

        principalPure: num(body.principalPure),
        policyFee: num(body.policyFee),
        totalAR: num(body.totalAR),
        totalInterest: num(body.totalInterest),
        totalLoan: num(body.totalLoan),
        policyFeeTDP: num(body.policyFeeTDP),
        firstInstallment: num(body.firstInstallment),
        nilaiAP: num(body.nilaiAP),
      },
    });

    return NextResponse.json(savedSimulation, { status: 201 });
  } catch (error) {
    console.error('Gagal menyimpan simulasi:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan saat menyimpan data.' }, { status: 500 });
  }
}

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;

  try {
    const simulations = await prisma.simulation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(simulations);
  } catch (error) {
    console.error('Gagal mengambil simulasi:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
