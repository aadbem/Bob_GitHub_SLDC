const MAX_COMPANIES = 5;

const companies = [
  { symbol: 'IBM', name: 'IBM' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'ORCL', name: 'Oracle' },
  { symbol: 'SAP', name: 'SAP' },
  { symbol: 'CRM', name: 'Salesforce' },
];

if (companies.length > MAX_COMPANIES) {
  throw new Error(`O limite máximo de empresas é ${MAX_COMPANIES}.`);
}

export { companies, MAX_COMPANIES };

export type Company = (typeof companies)[number];
