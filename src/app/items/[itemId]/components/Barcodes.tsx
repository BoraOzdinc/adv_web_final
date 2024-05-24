import { type ColumnDef } from "@tanstack/react-table";
import { CheckCircle2Icon, EllipsisVertical, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "~/app/_components/tables/generic-table";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Checkbox } from "~/app/_components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import { type RouterOutputs, api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { useAddBarcode, useUpdateBarcode } from "~/app/utils/useItems";

type itemBarcodeData = RouterOutputs["item"]["getItemBarcodesWithId"];

interface FormType {
  barcode: string;
  unit: string;
  isMaster: boolean;
  quantity: number;
}

const Barcodes = ({ itemId }: { itemId: string }) => {
  const [barcode, setBarcode] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [isMaster, setIsMaster] = useState<boolean>(false);
  const barcodeData = api.item.getItemBarcodesWithId.useQuery({ itemId });
  const addBarcode = useAddBarcode();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Barcodes</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Barcode</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Barcode</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Barcode</Label>
              <Input
                value={barcode}
                onChange={(a) => {
                  setBarcode(a.target.value);
                }}
              />
            </div>
            <div>
              <Label>Unit</Label>
              <Input
                value={unit}
                onChange={(a) => {
                  setUnit(a.target.value);
                }}
              />
            </div>
            <div>
              <Label>Pieces in a unit</Label>
              <Input
                value={quantity}
                type="number"
                onChange={(a) => {
                  setQuantity(a.target.value);
                }}
              />
            </div>
            <div className="items-top flex space-x-2">
              <Checkbox
                id="isMaster"
                onClick={() => {
                  setIsMaster(!isMaster);
                }}
                checked={isMaster}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="isMaster"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Is Master Barcode
                </label>
                <p className="text-sm text-muted-foreground">
                  When you select it as the Master Barcode, this barcode appears
                  in the items list.
                </p>
              </div>
            </div>
            <DialogClose asChild>
              <Button
                isLoading={addBarcode.isPending}
                disabled={
                  barcode.length < 1 || quantity.length < 1 || unit.length < 1
                }
                onClick={() => {
                  addBarcode.mutate({
                    barcode: barcode,
                    quantity: quantity,
                    unit: unit,
                    isMaster: isMaster,
                    itemId: itemId,
                  });
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="overflow-scroll sm:overflow-hidden">
        <DataTable
          data={barcodeData.data}
          columns={itemBarcodeColumns}
          isLoading={barcodeData.isLoading}
        />
      </CardContent>
    </Card>
  );
};

const itemBarcodeColumns: ColumnDef<itemBarcodeData[number]>[] = [
  {
    id: "action",
    cell: ({ row: { original } }) => <ActionColumn barcode={original} />,
  },
  { accessorKey: "barcode", header: "Barcode" },
  { accessorKey: "unit", header: "Unit" },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "isMaster",
    header: "Is Master",
    cell: ({
      row: {
        original: { isMaster },
      },
    }) => {
      if (!isMaster) {
        return <XCircleIcon />;
      }
      return <CheckCircle2Icon />;
    },
  },
];

const ActionColumn = ({
  barcode,
}: {
  barcode: {
    id: string;
    barcode: string;
    unit: string;
    isMaster: boolean;
    quantity: number;
    itemId: string;
  };
}) => {
  const updateBarcode = useUpdateBarcode();
  const form = useForm<FormType>({ defaultValues: { ...barcode } });
  const onSubmitForm = (data: FormType) => {
    updateBarcode.mutate({
      barcode: data.barcode,
      barcodeId: barcode.id,
      isMaster: data.isMaster,
      quantity: String(data.quantity),
      unit: data.unit,
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              disabled={barcode.isMaster}
            >
              Make Master Barcode
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This barcode will be set as the master barcode and this barcode
                will appear in the lists!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    updateBarcode.mutate({
                      barcode: barcode.barcode,
                      barcodeId: barcode.id,
                      isMaster: true,
                      quantity: String(barcode.quantity),
                      unit: barcode.unit,
                    })
                  }
                >
                  Confirm
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Barcode</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm)}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-3">
                  <FormField
                    name="barcode"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barcode</FormLabel>
                        <FormControl>
                          <Input placeholder="Barcode..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="unit"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="Unit..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="quantity"
                    rules={{ required: true }}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pieces in a Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="Pieces in a Unit..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isMaster"
                    render={({ field }) => (
                      <FormItem className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Is Master Barcode</FormLabel>
                          <FormDescription>
                            When you select it as the Master Barcode, this
                            barcode appears in the items list.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      type="button"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button type="submit">Confirm</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Barcodes;
