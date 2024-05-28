"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";

const LocationDetailPage = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const locationDetails = api.location.getLocationDetailsWithId.useQuery({
    locationId,
  });
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{locationDetails.data?.name}</CardTitle>
          <CardDescription>All items in this location.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-5">
        {locationDetails.data?.items.map((item) => {
          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.item.name}</CardTitle>
                <CardDescription>Quantity: {item.quantity}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LocationDetailPage;
