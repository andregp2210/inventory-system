"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CardContainer from "@/components/ui/card-container";
import useProductsData from "@/hooks/use-get-dashboard-data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const {
    salesLoading,
    categoriesLoading,
    productsLoading,
    lowStockProducts,
    totalProducts,
    outOfStock,
    salesData,
    productsByCategory,
    salesError,
    productsError,
    categoriesError,
  } = useProductsData();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardContainer title="Total Products" showLoader={productsLoading}>
          {productsError ? (
            <p className="text-red-500">{productsError}</p>
          ) : (
            <p className="text-4xl font-bold">{totalProducts}</p>
          )}
        </CardContainer>
        <CardContainer title="Low Stock Items" showLoader={productsLoading}>
          {productsError ? (
            <p className="text-red-500">{productsError}</p>
          ) : (
            <p className="text-4xl font-bold">{lowStockProducts}</p>
          )}
        </CardContainer>
        <CardContainer title="Out of Stock" showLoader={productsLoading}>
          {productsError ? (
            <p className="text-red-500">{productsError}</p>
          ) : (
            <p className="text-4xl font-bold">{outOfStock}</p>
          )}
        </CardContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardContainer
          title="Monthly Sales"
          showLoader={salesLoading}
          loaderClassName="h-96 w-full"
        >
          {salesError ? (
            <p className="text-red-500">{salesError}</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContainer>
        <CardContainer
          title="Products by Category"
          showLoader={categoriesLoading || productsLoading}
          loaderClassName="h-96 w-full"
        >
          {categoriesError || productsError ? (
            <>
              <p className="text-red-500">{categoriesError}</p>
              <p className="text-red-500">{productsError}</p>
            </>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productsByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContainer>
      </div>
      <div className="flex flex-wrap">
        <Link href="/products">
          <Button variant="secondary" className="mr-2">
            View Products
          </Button>
        </Link>
        <Link href="/categories">
          <Button variant="outline" className="mr-2">Manage Categories</Button>
        </Link>
        <Link href="/kardex">
          <Button variant="outline" className="mt-2">Kardex Operations</Button>
        </Link>
      </div>
    </div>
  );
}
