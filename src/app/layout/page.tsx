"use client";
import { type RouterOutputs, api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { Loader2Icon } from "lucide-react";
import LocationCard from "./components/LocationCard";
import { useAddLocation } from "../utils/useLocation";
import { Button } from "../_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../_components/ui/dialog";
import { Label } from "../_components/ui/label";
import { Input } from "../_components/ui/input";
import { useState } from "react";

export type locationsType = RouterOutputs["location"]["getLocations"];

const Layout = () => {
  const locations = api.location.getLocations.useQuery();
  const [locName, setLocName] = useState("");
  const addLocation = useAddLocation();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Layout</CardTitle>
          <CardDescription>Click location for details.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Location</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Location</DialogTitle>
            </DialogHeader>
            <div>
              <Label>Location Name</Label>
              <Input
                placeholder="Name..."
                value={locName}
                onChange={(e) => {
                  setLocName(e.target.value);
                }}
              />
            </div>
            <DialogClose>
              <Button
                disabled={!locName.length}
                onClick={() => {
                  addLocation.mutate({ name: locName });
                }}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-5">
        {locations.data && !locations.data.length && <p>No Locations!</p>}
        {locations.data ? (
          locations.data.map((l) => (
            <LocationCard key={l.id} locationDetails={l} />
          ))
        ) : (
          <Loader2Icon className="h-8 w-8 animate-spin" />
        )}
      </CardContent>
    </Card>
  );
};

export default Layout;
