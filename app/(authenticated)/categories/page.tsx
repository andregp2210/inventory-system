"use client";

import { useState, useEffect } from "react";

import { categoriesCrud } from "@/lib/queries";
import { Category } from "@/lib/types/category";
import CategoryContainer from "./container";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const categories = await categoriesCrud.getAll();
      setCategories(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <CategoryContainer
          categoriesList={categories}
          isLoading={isLoading}
          error={error}
          getAllCategories={getAllCategories}
        />
      )}
    </div>
  );
}
