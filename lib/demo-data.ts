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
        const baseRate = category === 'PASSENGER' ? 0.0885 : 0.0965;
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
    label: 'Comprehensive (Data Demo)',
    minPrice: 0,
    maxPrice: 9_999_999_999_999,
    rate: Number((0.013 + tenor * 0.004 + adjustment).toFixed(5)),
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
    borrowerName: 'Nasabah Demo',
    salesName: 'Sales Juara',
    status: 'TODO',
    attachments: null,
    unitName: 'Toyota Avanza (Demo)',
    category: 'PASSENGER',
    nopol: 'B 1234 DEMO',
    vehiclePrice: 250_000_000,
    dpPercent: 20,
    dpAmount: 50_000_000,
    principalPure: 200_000_000,
    tenor: 36,
    interestRate: 0.0845,
    totalInterest: 53_082_000,
    insuranceLabel: 'Comprehensive (Data Demo)',
    insuranceRate: 0.025,
    insuranceAmount: 6_250_000,
    policyFee: 100_000,
    totalAR: 206_350_000,
    totalLoan: 259_432_000,
    monthlyPayment: 7_210_000,
    nilaiAP: 196_950_000,
    adminFee: 3_000_000,
    policyFeeTDP: 50_000,
    firstInstallment: 0,
    totalFirstPay: 53_050_000,
    paymentType: 'ADDB',
  },
];
