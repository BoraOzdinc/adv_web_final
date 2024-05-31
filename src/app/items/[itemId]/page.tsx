"use client";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import Barcodes from "./components/Barcodes";
import ItemDetails from "./components/ItemDetails";
import LocationData from "./components/LocationData";

const ItemDetail = () => {
  const params = useParams<{ itemId: string }>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ItemDetails itemId={params.itemId} />
        <Barcodes itemId={params.itemId} />
        <LocationData itemId={params.itemId}/>
      </CardContent>
    </Card>
  );
};

export default ItemDetail;
