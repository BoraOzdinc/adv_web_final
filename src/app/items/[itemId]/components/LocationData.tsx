import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";

const LocationData = ({ itemId }: { itemId: string }) => {
  const locationData = api.location.getItemLocations.useQuery({ itemId });
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Items Locations</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-5">
        {locationData.data?.map((l) => (
          <Card key={l.id}>
            <CardHeader>
              <CardTitle>{l.location?.name}</CardTitle>
              <CardDescription>Quantity: {l.quantity}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default LocationData;
