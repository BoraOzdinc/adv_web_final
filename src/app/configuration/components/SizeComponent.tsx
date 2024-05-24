"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./sizeColumns";
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
import { api, type RouterOutputs } from "~/trpc/react";
import { useAddSize } from "~/app/utils/useItems";

export type getSizesType = RouterOutputs["item"]["getSize"];

const SizeComp = () => {
  const sizes = api.item.getSize.useQuery();
  const [sizeCode, setSizeCode] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const addSize = useAddSize();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Item Sizes</CardTitle>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={sizes.isLoading || addSize.isPending}
              isLoading={addSize.isPending}
            >
              Add Size
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>YNew Size</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Size Code</Label>
              <Input
                value={sizeCode}
                onChange={(v) => {
                  setSizeCode(v.target.value);
                }}
                placeholder="Size Code..."
              />
            </div>
            <div>
              <Label>Size Text</Label>
              <Input
                value={size}
                onChange={(v) => {
                  setSize(v.target.value);
                }}
                placeholder="Size Text..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addSize.isPending}
                disabled={
                  (sizeCode.length < 1 && size.length < 1) || addSize.isPending
                }
                onClick={() => {
                  addSize.mutate({ sizeCode: sizeCode, sizeText: size });
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <DataTable
          data={sizes.data ?? []}
          columns={columns}
          isLoading={sizes.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default SizeComp;
