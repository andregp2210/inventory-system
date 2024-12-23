"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "../ui/input";
import DropdownFilter from "./dropdown-filter";
import ProductCard from "./product-card";
import { debounce } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { ProductFormDialog } from "./product-form-dialog";

type Props = {
  products: {
    skuCode: string;
    name: string;
    unitPrice: number;
    currentStock: number;
    minimumStock: number;
  }[];
};

export const ProductsContainer = ({ products }: Props) => {
  const supabase = createClient();
  const [baseProducts, setBaseProducts] = useState(products);
  const [productsList, setProductsList] = useState(baseProducts);
  const [resetFilters, setResetFilters] = useState(false);
  const [shouldRefreshProducts, setShouldRefreshProducts] = useState(false);

  const handleOrderByStock = (checked: boolean) => {
    if (checked) {
      const sortedProducts = [...productsList].sort(
        (a, b) => a.currentStock - b.currentStock
      );
      setProductsList(sortedProducts);
    } else {
      setProductsList(baseProducts);
    }
  };

  const debounceSearch = useCallback(
    debounce((term) => {
      const lowerCaseTerm = term.toLowerCase();
      const filteredList = baseProducts.filter(({ name }) =>
        name.toLowerCase().includes(lowerCaseTerm)
      );
      setProductsList(filteredList);
      setResetFilters(false);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value);
    setResetFilters(true);
  };

  const refetchProducts = async () => {
    const { data } = await supabase.from("products").select();
    if (data) {
      setBaseProducts(data);
    }
  };

  useEffect(() => {
    console.log("shouldRefreshProducts ==>", shouldRefreshProducts);
    if (shouldRefreshProducts) {
      setShouldRefreshProducts(false);
      refetchProducts();
    }
  }, [shouldRefreshProducts]);

  useEffect(() => {
    setProductsList(baseProducts);
  }, [baseProducts]);

  console.log("shouldRefreshProducts", shouldRefreshProducts);

  return (
    <section className="space-y-3 px-3">
      <ProductFormDialog setShouldRefreshProducts={setShouldRefreshProducts}/>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          type="search"
          id="search"
          placeholder="Search"
          onChange={handleSearch}
        />
        <DropdownFilter
          label="Order by"
          handleOrderByStock={handleOrderByStock}
          resetFilters={resetFilters}
        />
      </div>
      {productsList.map(
        ({ skuCode, name, unitPrice, currentStock, minimumStock }, index) => (
          <ProductCard
            key={index}
            skuCode={skuCode}
            name={name}
            unitPrice={unitPrice}
            currentStock={currentStock}
            minimumStock={minimumStock}
            setShouldRefreshProducts={setShouldRefreshProducts}
          />
        )
      )}
    </section>
  );
};
