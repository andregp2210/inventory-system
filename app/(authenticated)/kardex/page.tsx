"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, ChevronDown, RefreshCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { KardexSkeleton } from "./skeleton";

import { movementsCrud, productsCrud } from "@/lib/queries";
import { useRequest } from "@/hooks/use-request";
import { KardexRecord } from "@/lib/types/movement";
import CardContainer from "@/components/ui/card-container";
import KardexTable from "./main-table";
import { KardexFormDialog } from "./add/kardex-form-dialog";
import { Product } from "@/lib/types/product";

export default function KardexPage() {
  const {
    data: kardexEntries,
    loading: isLoading,
    error: movementError,
    refetch: refetchMovements,
  } = useRequest<KardexRecord[]>(
    movementsCrud.execFunction,
    "get_kardex_data",
    {
      year_filter: 2024,
    }
  );

  const {
    data: products,
    loading: areProductsLoading,
    error: productsError,
  } = useRequest<Product[]>(productsCrud.getAll, "id, name");

  const [filteredEntries, setFilteredEntries] = useState<KardexRecord[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!kardexEntries) return;
    let result = kardexEntries;
    if (searchTerm) {
      result = result.filter(
        (entry: KardexRecord) =>
          entry.date.includes(searchTerm) ||
          entry.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredEntries(result as any);
  }, [kardexEntries, searchTerm, sortConfig]);

  const handleSelectChange = (value: any) => {
    //setNewEntry((prev) => ({ ...prev, type: value }));
  };

  const requestSort = (key: any) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Type", "Quantity", "Unit Cost", "Total Cost"],
      ...filteredEntries.map((entry: KardexRecord) => [
        entry.date,
        entry.type,
        entry.quantity,
        entry.unitPrice,
        entry.totalCost,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "kardex_entries.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    if (!isLoading && kardexEntries) {
      setLastUpdated(new Date());
    }
  }, [isLoading, kardexEntries]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-emerald-700">
          Kardex Operations
        </h1>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => requestSort("date")}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("type")}>
                Type
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("quantity")}>
                Quantity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort("totalCost")}>
                Total Cost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={refetchMovements}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <KardexFormDialog
            getAllMovements={refetchMovements}
            products={products || []}
          />
        </div>
      </div>
      <CardContainer
        titleClassName="flex justify-between items-center"
        title={
          <>
            <span>Kardex Entries</span>
            {lastUpdated && (
              <span className="text-sm font-normal text-gray-500">
                Last updated: {lastUpdated.toLocaleString()}
              </span>
            )}
          </>
        }
      >
        <div className="overflow-x-auto">
          {isLoading ? (
            <KardexSkeleton />
          ) : movementError ? (
            <p className="text-red-500">{movementError}</p>
          ) : (
            <KardexTable records={filteredEntries} />
          )}
        </div>
        <div ref={observerTarget} className="h-10" />
      </CardContainer>

      <div className="flex justify-between items-center"></div>
    </div>
  );
}
