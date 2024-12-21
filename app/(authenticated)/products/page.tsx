import { ProductsContainer } from "@/components/products-page/products-container";
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
  const { data } = await supabase.from("products").select();

  if (!data || data.length === 0) {
    return <div>No products found</div>;
  }
  return <ProductsContainer products={data}/>;
}
