import type { AppData } from '@/app/types/simulation';
import type { HistoryItem } from '@/app/types/history';

type DemoUser = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'SALES' | 'PROSESOR';
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: 9001,
    email: 'admin@setirkanan.co.id',
    password: 'admin123',
    name: 'Super Prosesor',
    role: 'PROSESOR',
  },
  {
    id: 9002,
    email: 'sales@setirkanan.co.id',
    password: 'sales123',
    name: 'Sales Juara',
    role: 'SALES',
  },
];

export function findDemoUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return DEMO_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password,
  );
}

const tenors = [12, 24, 36, 48, 60];
const vehicleCategories = ['PASSENGER', 'COMMERCIAL'];
const paymentTypes = ['ADDB', 'ADDM'];

let interestId = 1;
const interestRates = vehicleCategories.flatMap((category) =>
  paymentTypes.flatMap((paymentType) =>
    Array.from({ length: 7 }, (_, index) => index + 1).flatMap((star) =>
      tenors.map((tenor) => {
        // Anchored to the last verified production example:
        // PASSENGER, ADDB, Star 5, 36 months = 8.250% p.a.
        const baseRate = category === 'PASSENGER' ? 0.0865 : 0.0945;
        const tenorAdjustment = (tenor / 12 - 1) * 0.002;
        const paymentAdjustment = paymentType === 'ADDM' ? 0.001 : 0;
        const starDiscount = (star - 1) * 0.002;

        return {
          id: interestId++,
          category,
          paymentType,
          star,
          tenor,
          rate: Number(
            (baseRate + tenorAdjustment + paymentAdjustment - starDiscount).toFixed(5),
          ),
        };
      }),
    ),
  ),
);

const insuranceCategories = [
  { category: 'PASSENGER', adjustment: 0 },
  { category: 'COMMERCIAL_LOADING', adjustment: 0.012 },
  { category: 'COMMERCIAL_USED', adjustment: 0.01 },
  { category: 'COMMERCIAL_LOADING_TRUCK', adjustment: 0.018 },
  { category: 'COMMERCIAL_USED_TRUCK', adjustment: 0.016 },
  { category: 'COMMERCIAL_LOADING_BUS', adjustment: 0.016 },
  { category: 'COMMERCIAL_USED_BUS', adjustment: 0.014 },
];

let insuranceId = 1;
const insuranceRates = insuranceCategories.flatMap(({ category, adjustment }) =>
  Array.from({ length: 5 }, (_, index) => index + 1).map((tenor) => ({
    id: insuranceId++,
    category,
    tenor,
    label: `${tenor} THN TLO`,
    minPrice: 0,
    maxPrice: 9_999_999_999_999,
    // PASSENGER tenor 3 is anchored to the verified 2.268% example.
    rate: Number((0.01068 + tenor * 0.004 + adjustment).toFixed(5)),
  })),
);

export const DEMO_RATES: AppData = {
  interestRates,
  insuranceRates,
  demoMode: true,
};

export const DEMO_SIMULATIONS: HistoryItem[] = [
  {
    id: 9001,
    createdAt: '2026-11-06T06:00:00.000Z',
    borrowerName: 'Raka Mahendra',
    salesName: 'Dimas Pratama',
    status: 'TODO',
    attachments: null,
    unitName: 'Toyota Avanza 1.5 G CVT',
    category: 'PASSENGER',
    nopol: 'B 1847 RKP',
    vehiclePrice: 300_000_000,
    dpPercent: 20,
    dpAmount: 60_000_000,
    principalPure: 240_000_000,
    tenor: 36,
    interestRate: 0.0825,
    totalInterest: 61_108_700,
    insuranceLabel: '3 THN TLO',
    insuranceRate: 0.02268,
    insuranceAmount: 6_804_000,
    policyFee: 100_000,
    totalAR: 246_904_000,
    totalLoan: 308_012_700,
    monthlyPayment: 8_560_000,
    nilaiAP: 236_950_000,
    adminFee: 3_000_000,
    policyFeeTDP: 50_000,
    firstInstallment: 0,
    totalFirstPay: 63_050_000,
    paymentType: 'ADDB',
  },
];
