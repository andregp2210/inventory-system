import { Product } from "./product";

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

export type KardexRecord = {
  [key: string]: any;
  movementId: number;
  date: string;
  type: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  locationName: string | null;
  customerName: string | null;
  supplierName: string | null;
  notes: string | null;
};

export type KardexEntry = {
  movementType: "entry" | "exit";
  productId: number;
  quantity: number;
  locationId: number | null;
  movementDate: string;
};
