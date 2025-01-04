import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { formatDate, formatToLocalCurrency } from "@/lib/utils";
import { KardexRecord } from "@/lib/types/movement";

const KardexTable = ({
  records,
}: {
  records: KardexRecord[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Unit Cost</TableHead>
          <TableHead className="text-right">Total Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {records.map((entry: KardexRecord) => (
            <motion.tr
              key={entry.movementId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell className="font-medium">
                {formatDate(entry.date, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell>
                {entry.type === "entry" ? (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full text-white inline-block bg-emerald-500">
                    Purchase
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full text-white inline-block bg-red-500">
                    Sale
                  </span>
                )}
              </TableCell>
              <TableCell>{entry.productName}</TableCell>
              <TableCell className="text-right">{entry.quantity}</TableCell>
              <TableCell className="text-right">
                {formatToLocalCurrency(entry.unitPrice)}
              </TableCell>
              <TableCell className="text-right">
                {formatToLocalCurrency(entry.totalCost)}
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
};

export default KardexTable;
