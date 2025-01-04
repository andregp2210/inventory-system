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

const COLORS = [
  "#FF6F61", // Rojo coral vibrante
  "#FFA177", // Naranja brillante
  "#FFD966", // Amarillo mostaza claro
  "#8FBC8F", // Verde salvia
  "#87CEFA", // Azul cielo brillante
  "#9370DB", // Lila intenso
  "#FF69B4", // Rosa chicle
  "#4682B4", // Azul acero claro
  "#90EE90", // Verde claro vibrante
  "#FFB347", // Naranja melocotón
  "#FF4040", // Rojo vivo
  "#7B68EE", // Azul violeta
  "#66CDAA", // Verde aguamarina
  "#FFC0CB", // Rosa pastel marcado
  "#FFA500", // Naranja vibrante
];

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
      <div className="flex flex-wrap">
        <Link href="/products">
          <Button variant="secondary" className="mr-2">
            View Products
          </Button>
        </Link>
        <Link href="/categories">
          <Button variant="outline" className="mr-2">
            Manage Categories
          </Button>
        </Link>
        <Link href="/kardex">
          <Button variant="outline" className="mt-2 sm:mt-0">
            Kardex Operations
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/products">
          <CardContainer title="Total Products" showLoader={productsLoading}>
            {productsError ? (
              <p className="text-red-500">{productsError}</p>
            ) : (
              <p className="text-4xl font-bold">{totalProducts}</p>
            )}
          </CardContainer>
        </Link>
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
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#10b981">
                    {salesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.sales < 100 ? "#FCA5A5" : "#10b981"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#10b981] mr-2"></div>
                  <span className="text-sm">Sales ≥ 100</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#FCA5A5] mr-2"></div>
                  <span className="text-sm">Sales &lt; 100</span>
                </div>
              </div>
            </>
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
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {productsByCategory.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContainer>
      </div>
    </div>
  );
}
