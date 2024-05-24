"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./brandColumns";
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
import { useAddBrand } from "~/app/utils/useItems";

export type getBrandsType = RouterOutputs["item"]["getBrand"];

const BrandComp = () => {
  const brands = api.item.getBrand.useQuery();
  const [brand, setBrand] = useState<string>("");
  const addBrand = useAddBrand();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Brands</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={brands.isLoading || addBrand.isPending}
              isLoading={addBrand.isPending}
            >
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Brand</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Brand Name</Label>
              <Input
                value={brand}
                onChange={(v) => {
                  setBrand(v.target.value);
                }}
                placeholder="Brand..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addBrand.isPending}
                disabled={brand.length < 1 || addBrand.isPending}
                onClick={() => {
                  addBrand.mutate({ name: brand });
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
          data={brands.data ?? []}
          columns={columns}
          isLoading={brands.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default BrandComp;
