import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatToLocalCurrency } from "@/lib/utils";
import { InfoIcon } from "@/components/ui/icons/info";
import LowStockPopOver from "./low-stock-pop-over";
import Swal from "sweetalert2";
import {
  showDeleteAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/components/ui/swal-dialogs";
import { ProductFormDialog } from "./product-form-dialog";
import { IPrudctForm } from "./product-form";
import CardContainer from "@/components/ui/card-container";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
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
      showSuccessAlert("Su producto se ha eliminado correctamente.");
    } catch (err) {
      showErrorAlert(
        "No se ha podido eliminar el producto",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleOpenDeleteDialog = async () => {
    showDeleteAlert(handleDelete);
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
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </Button>
          </>
        }
      >
        {isLowStock ? <LowStockPopOver /> : null}
        <p className="text-lg text-gray-600">SKU: {skuCode}</p>
        <p className="text-lg text-gray-600">Stock: {currentStock}</p>
        <p className="text-lg text-gray-600">
          Precio Unitario: {formatToLocalCurrency(unitPrice as number)}
        </p>
      </CardContainer>
    </>
  );
};

export default ProductCard;
