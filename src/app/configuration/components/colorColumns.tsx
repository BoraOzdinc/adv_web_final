import { type ColumnDef } from "@tanstack/react-table";
import { type getColorsType } from "./ColorComponent";

export const columns: ColumnDef<getColorsType[number]>[] = [
  { accessorKey: "colorCode", header: "Color Code" },
  { accessorKey: "colorText", header: "Color Text" },
];
