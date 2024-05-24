import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import ColorComp from "./components/ColorComponent";
import SizeComp from "./components/SizeComponent";
import CategoryComp from "./components/CategoryComponent";
import BrandComp from "./components/BrandComponent";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

const Settings = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Item Configurations</CardTitle>
      </CardHeader>
      <CardContent className=" grid grid-cols-1 gap-3 md:grid-cols-2">
        <ColorComp />
        <SizeComp />
        <CategoryComp />
        <BrandComp />
      </CardContent>
    </Card>
  );
};

export default Settings;
