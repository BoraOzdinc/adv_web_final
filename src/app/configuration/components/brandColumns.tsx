import { type ColumnDef } from "@tanstack/react-table";
import { type getBrandsType } from "./BrandComponent";

export const columns: ColumnDef<getBrandsType[number]>[] = [
  { accessorKey: "name", header: "Brand Name" },
];
