import React from "react";
import { Button } from "../ui/button";
import { formatToLocalCurrency } from "@/lib/utils";
import { InfoIcon } from "../ui/icons/info";
import LowStockPopOver from "./low-stock-pop-over";
import { createClient } from "@/utils/supabase/client";
import Swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";

type Props = {
  name: string;
  skuCode: string;
  unitPrice: number;
  currentStock: number;
  minimumStock: number;
  setShouldRefreshProducts: (value: boolean) => void;
};

const ProductCard = ({
  name,
  skuCode,
  unitPrice,
  currentStock,
  minimumStock,
  setShouldRefreshProducts,
}: Props) => {
  const supabase = createClient();
  const isLowStock = currentStock < minimumStock;

const handleDelete = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("skuCode", skuCode);
    if (error) {
      showErrorAlert("Something went wrong. Please try again", error.message);
    } else {
      setShouldRefreshProducts(true);
      showSuccessAlert("Your product was deleted successfully.");
    }
  } catch (error) {
    showErrorAlert("Could not connect to the server.");
  }
}


  const handleOpenDeleteDialog = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "bg-primary",
        cancelButton: "bg-destructive",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete()
      }
    });
    
  }

  const handleEdit = () => {
    // edit product
  }

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
        <Button variant="destructive" onClick={handleOpenDeleteDialog}>Delete</Button>
      </div>
    </article>
  );
};

export default ProductCard;


