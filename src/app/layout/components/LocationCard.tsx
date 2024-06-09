"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { type locationsType } from "../page";
import { useRouter } from "next/navigation";

const LocationCard = ({
  locationDetails,
}: {
  locationDetails: locationsType[number];
}) => {
  const totalItemCount = locationDetails.items.reduce((acc, cur) => {
    return (acc += cur.quantity);
  }, 0);
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={() => {
        router.push(`/layout/${locationDetails.id}`);
      }}
    >
      <CardHeader>
        <CardTitle>{locationDetails.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Item Here: {totalItemCount}</p>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
