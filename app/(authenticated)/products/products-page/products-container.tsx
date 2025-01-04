"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import DropdownFilter from "./dropdown-filter";
import ProductCard from "./product-card";
import { debounce } from "@/lib/utils";
import { ProductFormDialog } from "./product-form-dialog";
import { IPrudctForm } from "./product-form";
import { categoriesCrud, productsCrud } from "@/lib/queries";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { useRequest } from "@/hooks/use-request";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

type Props = {
  products: Product[];
};

export const ProductsContainer = ({ products }: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const { data: categories = [] } = useRequest<Category[]>(
    categoriesCrud.getAll,
    "id, name"
  );
  const [baseProducts, setBaseProducts] = useState(products);
  const [productsList, setProductsList] = useState(baseProducts);
  const [resetFilters, setResetFilters] = useState(false);
  const [shouldRefreshProducts, setShouldRefreshProducts] = useState(false);

  const handleOrderByStock = (checked: boolean) => {
    if (checked) {
      const sortedProducts = [...productsList].sort(
        (a, b) => Number(a.currentStock) - Number(b.currentStock)
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
    setShowLoader(true);
    const data = await productsCrud.getAll("");
    //.order("createdAt");
    if (data) {
      setBaseProducts(data);
    }
    setShowLoader(false);
  };

  useEffect(() => {
    if (shouldRefreshProducts) {
      setShouldRefreshProducts(false);
      refetchProducts();
    }
  }, [shouldRefreshProducts]);

  useEffect(() => {
    setProductsList(baseProducts);
  }, [baseProducts]);

  return (
    <>
      {showLoader ? <LoadingOverlay message="Cargando los productos..." /> : null}
      <section className="space-y-3 px-3">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            type="search"
            id="search"
            placeholder="Buscar productos..."
            onChange={handleSearch}
          />
        </div>
        <DropdownFilter
          variant="outline"
          label="Ordenar por"
          handleOrderByStock={handleOrderByStock}
          resetFilters={resetFilters}
        />
        <br />
        <ProductFormDialog
          setShouldRefreshProducts={setShouldRefreshProducts}
          categories={categories || []}
        />
        {productsList.map((product, index) => (
          <ProductCard
            key={index}
            product={product}
            categories={categories || []}
            setShouldRefreshProducts={setShouldRefreshProducts}
          />
        ))}
      </section>
    </>
  );
};
