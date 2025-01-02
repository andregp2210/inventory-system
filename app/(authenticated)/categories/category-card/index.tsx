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

type Props = {
  category: Category;
  getAllCategories: () => void;
};

const CategoryCard = ({ category, getAllCategories }: Props) => {
  const handleDeleteCategory = async () => {
    try {
      await categoriesCrud.remove(category.id);
      showSuccessAlert("Category deleted successfully!");
      getAllCategories();
    } catch (err) {
      showErrorAlert(
        "Failed to delete category",
        err instanceof Error ? err.message : "An error occurred"
      );
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
    <Card key={category.id} className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-emerald-700">
          {category.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{category.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
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
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;
