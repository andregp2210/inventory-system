"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, ChevronDown, RefreshCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { KardexSkeleton } from "./skeleton";
import { AnimatePresence, motion } from "framer-motion";

// Simulated API functions
const fetchKardexEntries = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return JSON.parse(localStorage.getItem("kardexEntries") || "[]");
};

interface KardexEntry {
  id?: number;
  date: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost?: number;
}

const addKardexEntry = async (entry: KardexEntry) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const entries = JSON.parse(localStorage.getItem("kardexEntries") || "[]");
  const newEntry = { ...entry, id: entries.length + 1 };
  entries.push(newEntry);
  localStorage.setItem("kardexEntries", JSON.stringify(entries));
  return newEntry;
};

export default function KardexPage() {
  const [kardexEntries, setKardexEntries] = useState<KardexEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: "",
    type: "",
    quantity: "",
    unitCost: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const observerTarget = useRef(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchKardexEntries();
      setKardexEntries(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch kardex entries. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch kardex entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let result = kardexEntries;
    if (searchTerm) {
      result = result.filter(
        (entry: KardexEntry) =>
          entry.date.includes(searchTerm) ||
          entry.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig !== null) {
      // result.sort((a, b) => {
      //   if (a[sortConfig.key] < b[sortConfig.key]) {
      //     return sortConfig.direction === "ascending" ? -1 : 1;
      //   }
      //   if (a[sortConfig.key] > b[sortConfig.key]) {
      //     return sortConfig.direction === "ascending" ? 1 : -1;
      //   }
      //   return 0;
      // });
    }
    setFilteredEntries(result as any);
  }, [kardexEntries, searchTerm, sortConfig]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: any) => {
    setNewEntry((prev) => ({ ...prev, type: value }));
  };

  const handleAddEntry = async () => {
    setIsLoading(true);
    try {
      const entryToAdd = {
        ...newEntry,
        quantity: parseInt(newEntry.quantity),
        unitCost: parseFloat(newEntry.unitCost),
        totalCost: parseInt(newEntry.quantity) * parseFloat(newEntry.unitCost),
      };
      const addedEntry = await addKardexEntry(entryToAdd);
      setKardexEntries((prev) => [...prev, addedEntry]);
      setNewEntry({ date: "", type: "", quantity: "", unitCost: "" });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "New kardex entry added successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add new kardex entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      ...filteredEntries.map((entry: KardexEntry) => [
        entry.date,
        entry.type,
        entry.quantity,
        entry.unitCost,
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

  // Infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          // Load more data here
          // For this example, we'll just simulate loading more data
          setTimeout(() => {
            setKardexEntries((prev) => [
              ...prev,
              ...Array(5)
                .fill(0)
                .map((_, index) => ({
                  id: prev.length + index + 1,
                  date: "2023-10-01",
                  type: "Purchase",
                  quantity: 100,
                  unitCost: 10,
                  totalCost: 1000,
                })),
            ]);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading]);

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
          <Button
            onClick={fetchData}
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
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Kardex Entry</DialogTitle>
                <DialogDescription>
                  Enter the details of the new kardex entry here. Click save
                  when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newEntry.date}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newEntry.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitCost" className="text-right">
                    Unit Cost
                  </Label>
                  <Input
                    id="unitCost"
                    name="unitCost"
                    type="number"
                    step="0.01"
                    value={newEntry.unitCost}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddEntry}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Kardex Entries</span>
            {lastUpdated && (
              <span className="text-sm font-normal text-gray-500">
                Last updated: {lastUpdated.toLocaleString()}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <KardexSkeleton />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredEntries.map((entry: KardexEntry) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium">
                          {entry.date}
                        </TableCell>
                        <TableCell>{entry.type}</TableCell>
                        <TableCell className="text-right">
                          {entry.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${entry.unitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${entry.totalCost?.toFixed(2)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
          <div ref={observerTarget} className="h-10" />
        </CardContent>
      </Card>
      <div className="flex justify-between items-center">
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
      </div>
    </div>
  );
}
