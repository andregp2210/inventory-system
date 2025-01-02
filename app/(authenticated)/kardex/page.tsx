'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for demonstration
const initialKardexEntries = [
  { id: 1, date: '2023-06-01', type: 'Purchase', quantity: 100, unitCost: 10, totalCost: 1000 },
  { id: 2, date: '2023-06-15', type: 'Sale', quantity: 50, unitCost: 10, totalCost: 500 },
  { id: 3, date: '2023-06-30', type: 'Purchase', quantity: 75, unitCost: 12, totalCost: 900 },
  { id: 4, date: '2023-07-10', type: 'Purchase', quantity: 120, unitCost: 11, totalCost: 1320 },
  { id: 5, date: '2023-07-25', type: 'Sale', quantity: 80, unitCost: 11, totalCost: 880 },
  { id: 6, date: '2023-08-05', type: 'Purchase', quantity: 150, unitCost: 13, totalCost: 1950 },
  { id: 7, date: '2023-08-20', type: 'Sale', quantity: 100, unitCost: 13, totalCost: 1300 },
  { id: 8, date: '2023-09-01', type: 'Purchase', quantity: 200, unitCost: 14, totalCost: 2800 },
  { id: 9, date: '2023-09-15', type: 'Sale', quantity: 150, unitCost: 14, totalCost: 2100 },
  { id: 10, date: '2023-09-30', type: 'Purchase', quantity: 250, unitCost: 15, totalCost: 3750 },
]

export default function KardexPage() {
  const [kardexEntries, setKardexEntries] = useState(initialKardexEntries)
  const [filteredEntries, setFilteredEntries] = useState(initialKardexEntries)
  const [newEntry, setNewEntry] = useState({ date: '', type: '', quantity: '', unitCost: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    let result = kardexEntries
    if (searchTerm) {
      result = result.filter(entry =>
        entry.date.includes(searchTerm) ||
        entry.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    setFilteredEntries(result)
  }, [kardexEntries, searchTerm, sortConfig])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewEntry(prev => ({ ...prev, type: value }))
  }

  const handleAddEntry = () => {
    const entryToAdd = {
      ...newEntry,
      id: kardexEntries.length + 1,
      quantity: parseInt(newEntry.quantity),
      unitCost: parseFloat(newEntry.unitCost),
      totalCost: parseInt(newEntry.quantity) * parseFloat(newEntry.unitCost)
    }
    setKardexEntries([...kardexEntries, entryToAdd])
    setNewEntry({ date: '', type: '', quantity: '', unitCost: '' })
    setIsDialogOpen(false)
  }

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const pageCount = Math.ceil(filteredEntries.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-emerald-700">Kardex Operations</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
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
                  Enter the details of the new kardex entry here. Click save when you're done.
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
                <Button type="submit" onClick={handleAddEntry}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Kardex Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                {paginatedEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.date}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell className="text-right">{entry.quantity}</TableCell>
                    <TableCell className="text-right">${entry.unitCost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${entry.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => requestSort('date')}>Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('type')}>Type</DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('quantity')}>Quantity</DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('totalCost')}>Total Cost</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {[...Array(pageCount)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                className={currentPage === pageCount ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
