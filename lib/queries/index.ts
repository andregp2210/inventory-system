import { createClient } from "@/utils/supabase/client";
import { Batch } from "../types/batch";
import { Category } from "../types/category";
import { Location } from "../types/location";
import { Movement } from "../types/movement";
import { Product } from "../types/product";
import { Supplier } from "../types/supplier";
import { Customer } from "../types/customer";

const supabase = createClient();

type CrudOperations<T> = {
  getAll: (columns?: string) => Promise<T[]>;
  getById: (id: number) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: number, data: Partial<T>) => Promise<T | null>;
  remove: (id: number) => Promise<boolean>;
};

const createCrud = <T>(tableName: string): CrudOperations<T> => ({
  async getAll(columns?: string): Promise<T[]> {
    const { data, error } = (await supabase
      .from(tableName)
      .select(columns || "*")) as { data: T[] | null; error: any };

    if (error) throw new Error(error.message);
    return data || [];
  },
  async getById(id: number): Promise<T | null> {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data || null;
  },
  async create(data: Partial<T>): Promise<T | null> {
    const { data: createdData, error } = await supabase
      .from(tableName)
      .insert(data)
      .single();

    if (error) throw new Error(error.message);
    return createdData || null;
  },
  async update(id: number, data: Partial<T>): Promise<T | null> {
    const { data: updatedData, error } = await supabase
      .from(tableName)
      .update(data)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return updatedData || null;
  },
  async remove(id: number): Promise<boolean> {
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },
});

const batchesCrud = createCrud<Batch>("batches");
const categoriesCrud = createCrud<Category>("categories");
const customersCrud = createCrud<Customer>("customers");
const locationsCrud = createCrud<Location>("customers");
const movementsCrud = createCrud<Movement>("movements");
const productsCrud = createCrud<Product>("products");
const suppliersCrud = createCrud<Supplier>("suppliers");

export {
  batchesCrud,
  categoriesCrud,
  customersCrud,
  locationsCrud,
  movementsCrud,
  productsCrud,
  suppliersCrud,
};