import { type ColumnDef } from "@tanstack/react-table";
import { type getCategoryType } from "./CategoryComponent";

export const columns: ColumnDef<getCategoryType[number]>[] = [
  { accessorKey: "name", header: "Category Name" },
];
