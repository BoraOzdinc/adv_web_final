"use client";

import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "~/app/_components/ui/badge";
import { Button } from "~/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";
import { useAddTags } from "~/app/utils/useItems";
import { api } from "~/trpc/react";

const ItemTags = () => {
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [tagString, setTagString] = useState<string>("");
  const { data: tags, isLoading } = api.item.getTags.useQuery();
  const addTags = useAddTags();
  const isDuplicate = addedTags.includes(tagString);

  useEffect(() => {
    if (tags) {
      const tagNames = tags.map((tag) => tag.name);
      setAddedTags(tagNames);
    }
  }, [tags]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <Input
            placeholder="Tag..."
            value={tagString}
            onChange={(e) => setTagString(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant={"outline"}
            disabled={!tagString || isDuplicate || isLoading}
            onClick={() => {
              if (tagString && !isDuplicate) {
                setAddedTags([tagString, ...addedTags]);
                setTagString("");
              }
            }}
          >
            +
          </Button>
        </div>
        <Button
          disabled={isLoading}
          onClick={() => {
            addTags.mutate({ tags: addedTags });
          }}
        >
          Save
        </Button>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
        {addedTags.map((t, index) => (
          <Badge
            className="inline-flex cursor-pointer text-lg hover:bg-destructive"
            key={index}
            onClick={() => {
              setAddedTags((prevItems) =>
                prevItems.filter((_, i) => i !== index),
              );
            }}
          >
            {t}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
};

export default ItemTags;
