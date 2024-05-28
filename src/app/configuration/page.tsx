import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import ItemTags from "./components/tags";

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
      <CardContent>
        <ItemTags />
      </CardContent>
    </Card>
  );
};

export default Settings;
