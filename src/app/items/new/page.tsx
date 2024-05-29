"use client";
import { useState } from "react";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import { Label } from "~/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";
import { useAddItem } from "~/app/utils/useItems";
import { api } from "~/trpc/react";

const NewItem = () => {
  const { data: tags } = api.item.getTags.useQuery();
  const [itemName, setItemName] = useState("");
  const [selectedTagId, setSelectedTagId] = useState("");
  const addItem = useAddItem();
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Item</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <Label>Item Name</Label>
          <Input
            placeholder="Name..."
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Item Tag</Label>
          <Select value={selectedTagId} onValueChange={setSelectedTagId}>
            <SelectTrigger>
              <SelectValue placeholder="Tag..." />
            </SelectTrigger>
            <SelectContent>
              {tags?.map((t) => (
                <SelectItem value={t.id} key={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full"
          isLoading={addItem.isPending}
          disabled={!itemName || !selectedTagId || addItem.isPending}
          onClick={() => {
            addItem.mutate({
              name: itemName,
              tag: selectedTagId,
            });
          }}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewItem;
