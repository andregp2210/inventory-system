import { useState, useEffect, useRef } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper";
import { IFormInput, ProductForm } from "./product-form";
import { createClient } from "@/utils/supabase/client";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";
import { FormikProps } from "formik";
import Swal from "sweetalert2";

const supabase = createClient();

export const ProductFormDialog = ({
  setShouldRefreshProducts,
}: {
  setShouldRefreshProducts: (value: boolean) => void;
}) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const formikRef = useRef<FormikProps<IFormInput>>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      debugger;
      const { error } = await supabase
        .from("products")
        .insert([values])
        .single();
      if (error) {
        showErrorAlert("Failed to add product", error.message);
      } else {
        setShouldRefreshProducts(true);
        showSuccessAlert("Product added successfully!");
      }
    } catch (err) {
      showErrorAlert("Could not connect to the server.");
    }
  };

  return (
    <SwalWrapper
      title="Register Product"
      Component={ProductForm}
      openDialogText="Add product"
      componentProps={{
        categories,
        onSubmit: handleFormSubmit,
        ref: formikRef,
      }}
      onPreConfirm={async () => {
        if (formikRef.current) {
          await formikRef.current.submitForm(); // Submits the form
          const isValid = formikRef.current?.isValid; // Check form validity
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
