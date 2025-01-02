export type Movement = {
  id: number;
  productId: number;
  locationId: number | null;
  movementType: "entry" | "exit";
  quantity: number;
  movementDate: string;
  customerId: number | null;
  supplierId: number | null;
  notes: string | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
};
