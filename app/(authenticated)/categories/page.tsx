"use client";

import { useState, useEffect } from "react";

import { categoriesCrud } from "@/lib/queries";
import { Category } from "@/lib/types/category";
import CategoryContainer from "./container";
import { useRequest } from "@/hooks/use-request";
import { CategorySkeleton } from "./skeleton";

export default function CategoriesPage() {
  const {
    loading: isLoading,
    data: categories,
    error,
    refetch: getAllCategories,
  } = useRequest<Category[]>(categoriesCrud.getAll, "");

  return (
    <div className="space-y-6">
      {isLoading ? (
        <CategorySkeleton />
      ) : (
        <CategoryContainer
          categoriesList={categories || []}
          isLoading={isLoading}
          error={error}
          getAllCategories={getAllCategories}
        />
      )}
    </div>
  );
}
