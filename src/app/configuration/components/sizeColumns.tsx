import { type ColumnDef } from "@tanstack/react-table";
import { type getSizesType } from "./SizeComponent";

type sizeType = getSizesType[number];
export const columns: ColumnDef<sizeType>[] = [
  { accessorKey: "sizeCode", header: "Size Code" },
  { accessorKey: "sizeText", header: "Size Text" },
];
