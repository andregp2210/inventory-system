"use client";

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

type Checked = DropdownMenuCheckboxItemProps["checked"];

type Props = {
  label: string;
  variant?: "secondary" | "destructive" | "outline" | undefined;
  handleOrderByStock: (checked: boolean) => void;
  resetFilters: boolean;
};

const DropdownFilter = ({
  label,
  variant,
  handleOrderByStock,
  resetFilters,
}: Props) => {
  const [orderByStock, setOrderByStock] = useState<Checked>(false);

  useEffect(() => {
    if (resetFilters) {
      setOrderByStock(false);
    }
  }, [resetFilters]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant}>{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[95vw]">
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={orderByStock}
          onCheckedChange={(value) => {
            setOrderByStock(value);
            handleOrderByStock(value);
          }}
        >
          Existencias
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownFilter;
