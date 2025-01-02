'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

// Mock data for demonstration
const initialCategories = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
  { id: 3, name: 'Books', description: 'Books and publications' },
  { id: 4, name: 'Furniture', description: 'Home furniture and decor' },
  { id: 5, name: 'Groceries', description: 'Food and household items' },
  { id: 6, name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 7, name: 'Clothing', description: 'Apparel and fashion items' },
  { id: 8, name: 'Books', description: 'Books and publications' },
  { id: 9, name: 'Furniture', description: 'Home furniture and decor' },
  { id: 10, name: 'Groceries', description: 'Food and household items' },
  { id: 11, name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 12, name: 'Clothing', description: 'Apparel and fashion items' },
  { id: 13, name: 'Books', description: 'Books and publications' },
  { id: 14, name: 'Furniture', description: 'Home furniture and decor' },
  { id: 15, name: 'Groceries', description: 'Food and household items' },

]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [filteredCategories, setFilteredCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const [editingCategory, setEditingCategory] = useState<null | { id: number, name: string, description: string }>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    let result = categories
    if (searchTerm) {
      result = result.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    setFilteredCategories(result)
  }, [categories, searchTerm, sortConfig])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value })
    } else {
      setNewCategory(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddCategory = () => {
    const categoryToAdd = {
      ...newCategory,
      id: categories.length + 1,
    }
    setCategories([...categories, categoryToAdd])
    setNewCategory({ name: '', description: '' })
    setIsDialogOpen(false)
  }

  const handleEditCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(cat => cat.id === editingCategory.id ? editingCategory : cat))
      setEditingCategory(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id))
  }

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const pageCount = Math.ceil(filteredCategories.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-emerald-700">Categories</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto"
          />
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <DialogDescription>
                  {editingCategory ? 'Edit the details of the category here.' : 'Enter the details of the new category here. Click save when you\'re done.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editingCategory ? editingCategory.name : newCategory.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={editingCategory ? editingCategory.description : newCategory.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={editingCategory ? handleEditCategory : handleAddCategory}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCategories.map((category) => (
          <Card key={category.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-700">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Button variant="outline" className="flex-1 mr-2" onClick={() => {
                setEditingCategory(category)
                setIsDialogOpen(true)
              }}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" className="flex-1" onClick={() => handleDeleteCategory(category.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => requestSort('name')}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => requestSort('description')}>Description</DropdownMenuItem>
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

