import { ProdctsByCategoryChart, SalesDataChart } from "@/lib/types/charts";
import { useEffect, useState } from "react";
import { useRequest } from "./use-request";
import { categoriesCrud, movementsCrud, productsCrud } from "@/lib/queries";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";

const useProductsData = () => {
  const [salesData, setSalesData] = useState<SalesDataChart[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [outOfStock, setOutOfStock] = useState<number>(0);
  const [productsByCategory, setProductsByCategory] = useState<
    ProdctsByCategoryChart[]
  >([]);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useRequest<Category[]>(categoriesCrud.getAll, "id, name");

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
  } = useRequest<Product[]>(
    productsCrud.getAll,
    "categoryId,currentStock,minimumStock,id"
  );

  const {
    data: yearSales,
    loading: salesLoading,
    error: salesError,
  } = useRequest(movementsCrud.execFunction, "get_monthly_totals", {
    year_filter: 2024,
  });

  useEffect(() => {
    if (!productsLoading && products) {
      const lowStockCount = products.filter(
        (product) => product.currentStock <= product.minimumStock
      ).length;
      setLowStockProducts(lowStockCount);
      setTotalProducts(products.length);
      const outOfStockCount = products.filter(
        (product) => product.currentStock === 0
      ).length;
      setOutOfStock(outOfStockCount);
      if (!categoriesLoading && categories) {
        const productsByCategories = categories.map((category) => ({
          name: category.name,
          value: products.filter(
            (product) => product.categoryId === category.id
          ).length,
        }));
        setProductsByCategory(productsByCategories);
      }
    }
    if (!salesLoading && yearSales) {
      setSalesData(yearSales as any as SalesDataChart[]);
    }
  }, [
    categories,
    products,
    yearSales,
    categoriesLoading,
    productsLoading,
    salesLoading,
  ]);

  return {
    salesData,
    lowStockProducts,
    totalProducts,
    outOfStock,
    productsByCategory,
    categoriesLoading,
    productsLoading,
    salesLoading,
    categoriesError,
    productsError,
    salesError,
  };
};

export default useProductsData;
