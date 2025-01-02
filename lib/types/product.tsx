export type Product = {
  id: number;
  skuCode: string;
  name: string;
  description: string | null;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  categoryId: number | null;
  supplierId: number | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
};
