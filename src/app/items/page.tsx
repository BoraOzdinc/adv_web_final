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
import { Layers3Icon, PaletteIcon, RulerIcon, TagsIcon } from "lucide-react";
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
      return items.data.filter(
        (o) =>
          o.itemBarcode.find((b) => {
            if (b.isMaster) {
              return b.barcode
                .toLowerCase()
                .includes(debouncedSearchInput.toLowerCase());
            }
          }) ??
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
          columnFilter={[
            {
              columnToFilter: "itemBrandId",
              title: "Brand",
              options: [
                ...new Set(modifiedItemsData?.flatMap((i) => i.brand?.name)),
              ].map((b) => ({
                label: b ?? "",
                value: b ?? "",
              })),
              icon: <TagsIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemColorId",
              title: "Color",
              options: [
                ...new Set(
                  modifiedItemsData?.flatMap((i) => i.color?.colorCode),
                ),
              ].map((b) => ({
                label: b ?? "",
                value: b ?? "",
              })),
              icon: <PaletteIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemSizeId",
              title: "Size",
              options: [
                ...new Set(modifiedItemsData?.flatMap((i) => i.size?.sizeCode)),
              ].map((b) => ({
                label: b ?? "",
                value: b ?? "",
              })),
              icon: <RulerIcon className="mr-2 h-5 w-5" />,
            },
            {
              columnToFilter: "itemCategoryId",
              title: "Category",
              options: [
                ...new Set(modifiedItemsData?.flatMap((i) => i.category?.name)),
              ].map((b) => ({
                label: b ?? "",
                value: b ?? "",
              })),
              icon: <Layers3Icon className="mr-2 h-5 w-5" />,
            },
          ]}
          serverSearch={{
            setState: setSearchInput,
            state: searchInput,
            title: "Barcode, Name",
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
    accessorKey: "itemBarcode",
    header: "Master Barcode",
    cell: ({
      row: {
        original: { itemBarcode },
      },
    }) => {
      return itemBarcode.map((b) => {
        if (!b.isMaster) {
          return "-";
        }
        return b.barcode;
      })[0];
    },
  },
  {
    accessorKey: "itemColorId",
    header: "Color",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.color?.colorCode ?? "");
    },
    cell: ({
      row: {
        original: { color },
      },
    }) => {
      return `${color?.colorCode} ${color?.colorText}`;
    },
  },
  {
    accessorKey: "itemSizeId",
    header: "Size",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.size?.sizeCode ?? "");
    },
    cell: ({
      row: {
        original: { size },
      },
    }) => {
      return size?.sizeCode;
    },
  },
  {
    accessorKey: "itemCategoryId",
    header: "Category",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.category?.name ?? "");
    },
    cell: ({
      row: {
        original: { category },
      },
    }) => {
      return category?.name;
    },
  },
  {
    accessorKey: "itemBrandId",
    header: "Brand",
    filterFn: (row, id, value: Array<string>) => {
      return value.includes(row.original.brand?.name ?? "");
    },
    cell: ({
      row: {
        original: { brand },
      },
    }) => {
      return brand?.name;
    },
  },
];

export default ItemPage;
