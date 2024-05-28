/* eslint-disable @next/next/no-img-element */
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { useAddBarcode } from "~/app/utils/useItems";
import { api } from "~/trpc/react";

const Barcodes = ({ itemId }: { itemId: string }) => {
  const barcodeData = api.item.getItemBarcodesWithId.useQuery({ itemId });
  const addBarcode = useAddBarcode();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Barcode</CardTitle>
          <CardDescription>
            Right click and press save image to save the qr code.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            addBarcode.mutate({ itemId });
          }}
          disabled={(barcodeData.data?.length ?? 0) >= 1}
        >
          Add Barcode
        </Button>
      </CardHeader>
      <CardContent className="flex items-center justify-center overflow-scroll sm:overflow-hidden">
        {barcodeData.data?.map((b) => {
          return <img src={b.barcodeQr} key={b.id} alt="" />;
        })}
        {!barcodeData.data?.length && (
          <p>
            If you want to stick a QR code to this item please generate a QR
            code via Add Barcode button.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Barcodes;
