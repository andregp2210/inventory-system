import { ProductsContainer } from "./products-page/products-container";
import { createClient } from "@/utils/supabase/server";

import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "All products",
    description: "All products",
  };
}

export default async function Products() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select().order("createdAt");

  if (!data || data.length === 0) {
    return <div>No se encontraron productos</div>;
  }
  return <ProductsContainer products={data}/>;
}
