"use client";

import { type RouterOutputs, api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { DataTable } from "../_components/tables/generic-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

type getItemsType = RouterOutputs["item"]["getItems"];

const ItemPage = () => {
  const items = api.item.getItems.useQuery();

  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearchInput = useDebounce(searchInput, 750);

  const modifiedItemsData = useMemo(() => {
    if (items.data) {
      return items.data.filter((o) =>
        o.name.toLowerCase().includes(debouncedSearchInput.toLowerCase()),
      );
    }
    return [];
  }, [items.data, debouncedSearchInput]);
  const router = useRouter();
  return (
    <Card className=" w-full">
      <CardHeader>
        <CardTitle>Items List</CardTitle>
        <CardDescription>Click the item you want to edit.</CardDescription>
      </CardHeader>
      <CardContent className=" w-full overflow-x-auto ">
        <DataTable
          data={modifiedItemsData ?? []}
          columns={columns}
          isLoading={items.isLoading}
          onRowClick={({ original: { id } }) => {
            router.push(`/items/${id}`);
          }}
          serverSearch={{
            setState: setSearchInput,
            state: searchInput,
            title: "Name",
          }}
          pagination
        />
      </CardContent>
    </Card>
  );
};
const columns: ColumnDef<getItemsType[number]>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "itemTag",
    header: "Tag",
    cell({
      row: {
        original: { itemTag },
      },
    }) {
      return itemTag?.name ? itemTag?.name : "-";
    },
  },
];

export default ItemPage;
