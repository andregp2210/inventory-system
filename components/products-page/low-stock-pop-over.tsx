"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { InfoIcon } from "../ui/icons/info";
import { useState } from "react";

const LowStockPopOver = () => {
  const [userReadMessage, setUserReadMessage] = useState(false);
  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setTimeout(() => {
            setUserReadMessage(true);
          }, 500);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div>
          <InfoIcon
            classNames={`ml-4 text-destructive fill-destructive  w-4 h-4 ${userReadMessage ? "" : "animate-ping"} `}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="end"
        sideOffset={5}
        alignOffset={-10}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Warning this product is under its minimum stock.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LowStockPopOver;
