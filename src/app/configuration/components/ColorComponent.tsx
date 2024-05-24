"use client";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { columns } from "./colorColumns";
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
import { useAddColor } from "~/app/utils/useItems";

export type getColorsType = RouterOutputs["item"]["getColor"];

const ColorComp = () => {
  const colors = api.item.getColor.useQuery();
  const [colorCode, setColorCode] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const addColor = useAddColor();

  return (
    <Card className=" w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <CardTitle>Item Colors</CardTitle>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={colors.isLoading || addColor.isPending}
              isLoading={addColor.isPending}
            >
              Add Color
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Color</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Color Code</Label>
              <Input
                value={colorCode}
                onChange={(v) => {
                  setColorCode(v.target.value);
                }}
                placeholder="Color Code..."
              />
            </div>
            <div>
              <Label>Color Text</Label>
              <Input
                value={color}
                onChange={(v) => {
                  setColor(v.target.value);
                }}
                placeholder="Color Text..."
              />
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addColor.isPending}
                disabled={
                  (colorCode.length < 1 && color.length < 1) ||
                  addColor.isPending
                }
                onClick={() => {
                  addColor.mutate({ colorCode: colorCode, colorText: color });
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
          data={colors.data ?? []}
          columns={columns}
          isLoading={colors.isLoading}
          pagination
        />
      </CardContent>
    </Card>
  );
};

export default ColorComp;
