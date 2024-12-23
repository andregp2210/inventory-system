import { useState, useEffect } from "react";
import { SwalWrapper } from "@/components/ui/swal-wrapper";
import { ProductForm } from "./product-form";
import { createClient } from "@/utils/supabase/client";
import { showErrorAlert, showSuccessAlert } from "../ui/swal-dialogs";

const supabase = createClient();

export const ProductFormDialog = ({ setShouldRefreshProducts }: { setShouldRefreshProducts: (value: boolean) => void }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (values: any) => {
    try {
      const { error } = await supabase.from("products").insert([values]).single();
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
      componentProps={{ categories, onSubmit: handleFormSubmit }}
      onPreConfirm={async () => {
        await document.querySelector<HTMLFormElement>("form")?.requestSubmit();
      }}
    />
  );
};
