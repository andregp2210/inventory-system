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
          <TableHead className="w-[100px]">Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
          <TableHead className="text-right">Costo unitario</TableHead>
          <TableHead className="text-right">Costo total</TableHead>
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
                    Compra
                  </span>
                ) : (
                  <span className="px-3 py-1 text-sm font-semibold rounded-full text-white inline-block bg-red-500">
                    Venta
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
