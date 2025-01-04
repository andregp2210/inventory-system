import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Category } from "@/lib/types/category";
import { CategoryFormDialog } from "../add/category-form-dialog";
import { categoriesCrud } from "@/lib/queries";
import {
  showDeleteAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/components/ui/swal-dialogs";
import Swal from "sweetalert2";
import CardContainer from "@/components/ui/card-container";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useState } from "react";

type Props = {
  category: Category;
  getAllCategories: () => void;
};

const CategoryCard = ({ category, getAllCategories }: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const handleDeleteCategory = async () => {
    try {
      setShowLoader(true);
      await categoriesCrud.remove(category.id);
      showSuccessAlert("!Categoría eliminada correctamente!");
      getAllCategories();
    } catch (err) {
      showErrorAlert(
        "No se ha podido eliminar la categoría.",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleOpenDeleteDialog = async () => {
    showDeleteAlert(handleDeleteCategory);
  };

  return (
    <>
      {showLoader && <LoadingOverlay message="Eliminando el registro..." />}
      <CardContainer
        cardClassName="flex flex-col"
        title={category.name}
        titleClassName="text-xl font-semibold"
        footerClassName="flex justify-between mt-auto"
        footer={
          <>
            <CategoryFormDialog
              category={category}
              getAllCategories={getAllCategories}
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
        <p className="text-gray-600">{category.description}</p>
      </CardContainer>
    </>
  );
};

export default CategoryCard;
