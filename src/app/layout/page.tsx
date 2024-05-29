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
import jsPDF from "jspdf";

export type locationsType = RouterOutputs["location"]["getLocations"];

const Layout = () => {
  const locations = api.location.getLocations.useQuery();
  const [locName, setLocName] = useState("");
  const addLocation = useAddLocation();

  const generatePDF = async () => {
    const doc = new jsPDF();
    const qrCodesPerPage = 12;
    const qrCodeWidth = 50;
    const qrCodeHeight = 50;
    const horizontalSpacing = 20;
    const verticalSpacing = 20;

    const numColumns = 3;
    const startX =
      (doc.internal.pageSize.width -
        numColumns * qrCodeWidth -
        (numColumns - 1) * horizontalSpacing) /
      2;
    if (!locations.data) {
      return;
    }
    for (let i = 0; i < locations.data.length; i += qrCodesPerPage) {
      if (i > 0) {
        doc.addPage();
      }

      const locationsOnPage = locations.data.slice(i, i + qrCodesPerPage);
      for (let j = 0; j < locationsOnPage.length; j++) {
        const location = locationsOnPage[j];

        const columnIndex = j % numColumns;
        const rowIndex = Math.floor(j / numColumns);

        const qrCodeX =
          startX + columnIndex * (qrCodeWidth + horizontalSpacing);
        const qrCodeY =
          verticalSpacing + rowIndex * (qrCodeHeight + verticalSpacing);

        const qrCodeDataUrl = location?.qrLink;

        doc.addImage(
          qrCodeDataUrl ?? "",
          "PNG",
          qrCodeX,
          qrCodeY,
          qrCodeWidth,
          qrCodeHeight,
        );

        doc.text(location?.name ?? "", qrCodeX, qrCodeY + qrCodeHeight + 5);
      }
    }

    doc.save("locations_qr_codes.pdf");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Layout</CardTitle>
          <CardDescription>Click location for details.</CardDescription>
        </div>
        <div className="flex flex-row gap-2">
          <Button onClick={generatePDF}>Generate QrCodes</Button>
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
        </div>
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
