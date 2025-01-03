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
            classNames={` absolute top-5 right-5 text-destructive fill-destructive  w-7 h-7 ${userReadMessage ? "" : "animate-ping"} `}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="end"
        sideOffset={-35}
        alignOffset={-5}
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
