import React from "react";
import { Button } from "../ui/button";
import { formatToLocalCurrency } from "@/lib/utils";
import { InfoIcon } from "../ui/icons/info";
import LowStockPopOver from "./low-stock-pop-over";

type Props = {
  name: string;
  skuCode: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
};

const ProductCard = ({
  name,
  skuCode,
  unitPrice,
  currentStock,
  minimumStock,
}: Props) => {
  const isLowStock = currentStock < minimumStock;
  return (
    <article
      className={`border-2  font-oswald bg-white rounded-lg shadow-lg p-5 space-y-2 ${isLowStock ? "border-red-600" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold leading-[28px] font-oswald">
          {name} ({skuCode})
        </span>
        <span
          className={`text-lg font-extrabold leading-[20px] font-oswald flex items-center ${isLowStock ? "text-red-500" : ""}`}
        >
          Stock: {currentStock} {isLowStock ? <LowStockPopOver /> : null}
        </span>
      </div>
      <p>Unit Price: {formatToLocalCurrency(unitPrice)}</p>
      <div className="space-x-3">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </article>
  );
};

export default ProductCard;
