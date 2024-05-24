"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./categoryColumns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Label } from "~/app/_components/ui/label";
import { Input } from "~/app/_components/ui/input";
import { useState } from "react";
import { type RouterOutputs, api } from "~/trpc/react";
import { useAddCategory } from "~/app/utils/useItems";

export type getCategoryType = RouterOutputs["item"]["getCategory"];

const CategoryComp = () => {
  const categories = api.item.getCategory.useQuery();
  const [category, setCategory] = useState<string>("");
  const addCategory = useAddCategory();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Categories</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={categories.isLoading || addCategory.isPending}
              isLoading={addCategory.isPending}
            >
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Category</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Category Name</Label>
              <Input
                value={category}
                onChange={(v) => {
                  setCategory(v.target.value);
                }}
                placeholder="Category..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addCategory.isPending}
                disabled={category.length < 1 || addCategory.isPending}
                onClick={() => {
                  addCategory.mutate({ name: category });
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className=" w-full overflow-x-auto ">
        <DataTable
          data={categories.data ?? []}
          columns={columns}
          isLoading={categories.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default CategoryComp;
