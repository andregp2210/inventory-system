export type Batch = {
  id: number;
  productId: number;
  batchNumber: string;
  expirationDate: string | null;
  quantity: number;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
};
