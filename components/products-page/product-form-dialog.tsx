import { useState, useEffect, useRef } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper";
import { IPrudctForm, ProductForm } from "./product-form";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";
import { FormikProps } from "formik";
import Swal from "sweetalert2";
import { LoadingOverlay } from "../ui/loading-overlay";
import { categoriesCrud, productsCrud } from "@/lib/queries";
import { Category } from "@/lib/types/category";

const LOADING_MESSAGES = ["Editing information...", "Adding products..."];

export const ProductFormDialog = ({
  setShouldRefreshProducts,
  product,
  categories,
}: {
  setShouldRefreshProducts: (value: boolean) => void;
  product?: IPrudctForm;
  categories: Category[];
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const formikRef = useRef<FormikProps<IPrudctForm>>(null);

  const handleAddProduct = async (values: any) => {
    setShowLoader(true);
    try {
      const data = await productsCrud.create(values);
      setShouldRefreshProducts(true);
      showSuccessAlert("Product added successfully!");
    } catch (err) {
      showErrorAlert(
        "Failed to add product",
        err instanceof Error ? err.message : "An error occurred"
      );
    }
    setShowLoader(false);
  };

  const handleEditProduct = async (values: any) => {
    setShowLoader(true);
    try {
      const data = await productsCrud.update(values.id, values);
      console.log(data);
      setShouldRefreshProducts(true);
      showSuccessAlert("Product edited successfully!");
    } catch (err) {
      showErrorAlert(
        "Failed to edit product",
        err instanceof Error ? err.message : "An error occurred"
      );
    }
    setShowLoader(false);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (product) {
        handleEditProduct(values);
      } else {
        handleAddProduct(values);
      }
    } catch (err) {
      showErrorAlert("Could not connect to the server.");
    }
  };

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const data = await categoriesCrud.getAll("id,name");
  //     setCategories(data || []);
  //   };

  //   fetchCategories();
  // }, []);
  return (
    <>
      {showLoader ? (
        <LoadingOverlay
          message={product ? LOADING_MESSAGES[0] : LOADING_MESSAGES[1]}
        />
      ) : null}
      <SwalWrapper
        title="Register Product"
        Component={ProductForm}
        openDialogText={product ? "Edit" : "Add product"}
        isEdit={!!product}
        componentProps={{
          categories,
          onSubmit: handleFormSubmit,
          ref: formikRef,
          initialValues: product || undefined,
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
