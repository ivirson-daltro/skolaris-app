export interface SchoolDto {
  id: string;
  name: string;
  logoUrl: string | null;
  plan: string;
  cnpj: string | null;
  phone: string | null;
  addressZipCode: string | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  addressNeighborhood: string | null;
  addressCity: string | null;
  addressState: string | null;
  createdAt: string;
}
