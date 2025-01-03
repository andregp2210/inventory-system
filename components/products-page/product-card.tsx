import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { formatToLocalCurrency } from "@/lib/utils";
import { InfoIcon } from "../ui/icons/info";
import LowStockPopOver from "./low-stock-pop-over";
import Swal from "sweetalert2";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";
import { ProductFormDialog } from "./product-form-dialog";
import { IPrudctForm } from "./product-form";
import CardContainer from "../ui/card-container";
import { LoadingOverlay } from "../ui/loading-overlay";
import { Category } from "@/lib/types/category";
import { productsCrud } from "@/lib/queries";
import { Product } from "@/lib/types/product";

type Props = {
  product: Product;
  setShouldRefreshProducts: (value: boolean) => void;
  categories: Category[];
};

const ProductCard = ({
  product,
  categories,
  setShouldRefreshProducts,
}: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const { skuCode, name, unitPrice, currentStock, minimumStock } = product;
  const isLowStock = currentStock < minimumStock;

  const handleDelete = async () => {
    try {
      setShowLoader(true);
      await productsCrud.remove(product.id);
      setShouldRefreshProducts(true);
      showSuccessAlert("Your product was deleted successfully.");
    } catch (err) {
      showErrorAlert(
        "Failed to delete product",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

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
        handleDelete();
      }
    });
  };

  return (
    <>
      {showLoader ? <LoadingOverlay message="Deleting product..." /> : null}
      <CardContainer
        title={name}
        cardClassName={`relative z-0 font-oswald  ${isLowStock ? "border-red-600" : ""}`}
        titleClassName=" text-2xl font-bold leading-[28px] font-oswald"
        footer={
          <>
            <ProductFormDialog
              setShouldRefreshProducts={setShouldRefreshProducts}
              product={product as any as IPrudctForm}
              categories={categories}
            />
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleOpenDeleteDialog}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete 
            </Button>
          </>
        }
      >
        {isLowStock ? <LowStockPopOver /> : null}
        <p className="text-lg text-gray-600">SKU: {skuCode}</p>
        <p className="text-lg text-gray-600">Stock: {currentStock}</p>
        <p className="text-lg text-gray-600">
          Unit Price: {formatToLocalCurrency(unitPrice as number)}
        </p>
      </CardContainer>
    </>
  );
};

export default ProductCard;
