import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Category } from "@/lib/types/category";
import { CategoryFormDialog } from "../add/category-form-dialog";
import { categoriesCrud } from "@/lib/queries";
import { showErrorAlert, showSuccessAlert } from "@/components/ui/swal-dialogs";
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
      showSuccessAlert("Category deleted successfully!");
      getAllCategories();
    } catch (err) {
      showErrorAlert(
        "Failed to delete category",
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
        handleDeleteCategory();
      }
    });
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
              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
