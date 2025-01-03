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
  _movementType: "entry" | "exit";
  _productId: number;
  _quantity: number;
  _locationId: number | null;
  _movementDate: string;
  _createdBy: string;
  _customerId: number | null;
  _supplierId: number | null;
  _notes: string | null;
};
