export type AdvocateRow = {
  id: string;
  firstName: string;
  lastName: string;
  city?: string;
  degree?: string;
  specialties?: string[] | string;
  languages?: string[] | string;
  yearsOfExperience?: number | string;
  phoneNumber?: string;
};

type SearchField = string | string[] | number | boolean | null | undefined;

export function contains(field: SearchField, needle: string): boolean {
  const n = needle.trim().toLowerCase();
  if (!n) return true;              
  if (field == null) return false;

  if (Array.isArray(field)) {
    return field.some(s => String(s).toLowerCase().includes(n));
  }
  return String(field).toLowerCase().includes(n);
}

export function matchesAdvocateQuery(a: AdvocateRow, q: string): boolean {
  return (
    contains(a.firstName, q) ||
    contains(a.lastName, q) ||
    contains(a.city, q) ||
    contains(a.degree, q) ||
    contains(a.specialties as SearchField, q) ||
    contains(a.languages as SearchField, q) ||
    contains(a.yearsOfExperience as SearchField, q) ||
    contains(a.phoneNumber, q)
  );
}

export const buildAdvocateFilter = (q: string) =>
  (row: AdvocateRow) => matchesAdvocateQuery(row, q);
