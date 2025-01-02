import { useState, useEffect, useRef } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper";
import { IPrudctForm, ProductForm } from "./product-form";
import { createClient } from "@/utils/supabase/client";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";
import { FormikProps } from "formik";
import Swal from "sweetalert2";
import { init } from "next/dist/compiled/webpack/webpack";

const supabase = createClient();

export const ProductFormDialog = ({
  setShouldRefreshProducts,
  product,
}: {
  setShouldRefreshProducts: (value: boolean) => void;
  product?: IPrudctForm;
}) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const formikRef = useRef<FormikProps<IPrudctForm>>(null);

  const handleAddProduct = async (values: any) => {
    const { error } = await supabase.from("products").insert([values]).single();
    if (error) {
      showErrorAlert("Failed to add product", error.message);
    } else {
      setShouldRefreshProducts(true);
      showSuccessAlert("Product added successfully!");
    }
  };

  const handleEditProduct = async (values: any) => {
    const { error } = await supabase
      .from("products")
      .update([values])
      .match({ id: values.id });
    if (error) {
      showErrorAlert("Failed to edit product", error.message);
    } else {
      setShouldRefreshProducts(true);
      showSuccessAlert("Product edited successfully!");
    }
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

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  return (
    <SwalWrapper
      title="Register Product"
      Component={ProductForm}
      openDialogText={product ? "Edit" : "Add product"}
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
  );
};
