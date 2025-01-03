import { useRef, useState } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper";
import { CategoryFormProps, CategoryForm } from "./category-form";
import { showErrorAlert, showSuccessAlert } from "@/components/ui/swal-dialogs";
import { FormikProps } from "formik";
import Swal from "sweetalert2";
import { categoriesCrud } from "@/lib/queries";
import { Category } from "@/lib/types/category";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

const LOADING_MESSAGES = ["Editing information...", "Adding category..."];

export const CategoryFormDialog = ({
  category,
  getAllCategories,
}: {
  category?: Category;
  getAllCategories: () => void;
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const formikRef = useRef<FormikProps<CategoryFormProps>>(null);

  const handleAddProduct = async (values: any) => {
    try {
      setShowLoader(true);
      const valuesToSend = {
        ...values,
        id: undefined,
        description: values.description || null,
      };
      await categoriesCrud.create(valuesToSend);
      showSuccessAlert("Category added successfully!");
      getAllCategories();
    } catch (err) {
      showErrorAlert(
        "Failed to add category",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleEditProduct = async (values: CategoryFormProps) => {
    try {
      setShowLoader(true);
      await categoriesCrud.update(Number(values.id), {
        ...values,
        id: Number(values.id),
      });
      showSuccessAlert("Category edited successfully!");
      getAllCategories();
    } catch (err) {
      showErrorAlert(
        "Failed to edit category",
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setShowLoader(false);
    }
  };

  const handleFormSubmit = async (values: CategoryFormProps) => {
    try {
      if (category) {
        handleEditProduct(values);
      } else {
        handleAddProduct(values);
      }
    } catch (err) {
      showErrorAlert("Could not connect to the server.");
    }
  };

  return (
    <>
      {showLoader && (
        <LoadingOverlay
          message={category ? LOADING_MESSAGES[0] : LOADING_MESSAGES[1]}
        />
      )}
      <SwalWrapper
        title="Register Category"
        Component={CategoryForm}
        isEdit={!!category}
        openDialogText={category ? "Edit" : "Add category"}
        componentProps={{
          onSubmit: handleFormSubmit,
          ref: formikRef,
          initialValues: category || undefined,
        }}
        onPreConfirm={async () => {
          if (formikRef.current) {
            await formikRef.current.submitForm();
            const isValid = formikRef.current?.isValid;
            if (!isValid) {
              Swal.showValidationMessage(
                "Please fix the errors in the form before submitting."
              );
            }
          }
        }}
      />
    </>
  );
};
