import { createCrud } from ".";

export interface Location {
  id: number;
  name: string;
  address: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

const locationsCrud = createCrud<Location>("locations");
export default locationsCrud;
