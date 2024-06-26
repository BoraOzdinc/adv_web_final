"use client";

import { useDebounce } from "@uidotdev/usehooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/ui/sheet";
import {
  useAddItemToLocation,
  useUpdateItemToLocation,
} from "~/app/utils/useLocation";
import { api } from "~/trpc/react";

const LocationDetailPage = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [input, setInput] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const debouncedInput = useDebounce(input, 200);
  const locationDetails = api.location.getLocationDetailsWithId.useQuery({
    locationId,
  });
  const { data: items } = api.item.getItemWithName.useQuery(
    { name: debouncedInput },
    { enabled: debouncedInput.length >= 3 },
  );
  const addItem = useAddItemToLocation();
  const updateLocation = useUpdateItemToLocation();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{locationDetails.data?.name}</CardTitle>
          <CardDescription>All items in this location.</CardDescription>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button>Add Item</Button>
          </SheetTrigger>
          <SheetContent className="flex w-full flex-col items-center gap-4">
            <SheetHeader>
              <SheetTitle>Add Item</SheetTitle>
              <SheetDescription>
                Start typing the item name to add it to this location.
              </SheetDescription>
            </SheetHeader>
            <Input
              placeholder="type..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            {items?.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card className="w-full cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription>
                      How many of this item do you want to add
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(parseInt(e.target.value));
                    }}
                  />

                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setQuantity(1);
                        addItem.mutate({
                          locationId,
                          itemId: item.id,
                          quantity,
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            ))}
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {locationDetails.data?.items.length === 0 && <p>No Items Found!</p>}
        {locationDetails.data?.items.map((item) => {
          return (
            <Dialog
              key={item.id}
              onOpenChange={() => setUpdateQuantity(Number(item.quantity))}
            >
              <DialogTrigger asChild>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.item.name}</CardTitle>
                    <CardDescription>Quantity: {item.quantity}</CardDescription>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{item.item.name}</DialogTitle>
                  <DialogDescription>Edit this item</DialogDescription>
                </DialogHeader>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    placeholder="Quantity..."
                    type="number"
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      setUpdateQuantity(Number(e.target.value));
                    }}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        updateLocation.mutate({
                          locationItemDetailId: item.id,
                          quantity: updateQuantity,
                        });
                      }}
                    >
                      Confirm
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        updateLocation.mutate({
                          locationItemDetailId: item.id,
                          quantity: item.quantity - 1,
                        });
                      }}
                      disabled={item.quantity !== updateQuantity}
                    >
                      Take One
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LocationDetailPage;
