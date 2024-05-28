"use client";

import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

import { useUpdateItem } from "~/app/utils/useItems";
import { type RouterOutputs, api } from "~/trpc/react";

export interface FormInput {
  name: string;
  tag: string;
}

type getItemWithIdType = RouterOutputs["item"]["getItemWithId"];

const ItemDetails = ({ itemId }: { itemId: string }) => {
  const { data: itemData, isLoading } = api.item.getItemWithId.useQuery({
    itemId,
  });
  const updateItem = useUpdateItem();
  const onSubmitForm = async (data: FormInput) => {
    await updateItem.mutateAsync({ id: itemId, ...data });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item</CardTitle>
        <CardDescription>You can edit your item.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoading && itemData && !updateItem.isPending && (
          <ItemDetailsForm itemData={itemData} onSubmitForm={onSubmitForm} />
        )}
      </CardContent>
    </Card>
  );
};

const ItemDetailsForm = ({
  itemData,
  onSubmitForm,
}: {
  itemData: getItemWithIdType;
  onSubmitForm: (data: FormInput) => void;
}) => {
  const { data: tags, isLoading } = api.item.getTags.useQuery();
  const form = useForm<FormInput>({
    defaultValues: {
      name: itemData?.name,
      tag: itemData?.itemTagsId ?? undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div className="flex w-full flex-col gap-3">
          <FormField
            name="name"
            rules={{ required: true }}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ürün" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tag"
            rules={{ required: true }}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    name={field.name}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      ref={field.ref}
                      id="itemStorage"
                    >
                      <SelectValue placeholder="Tag..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tags?.map((s) => {
                        return (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={!form.formState.isDirty || !form.formState.isValid}
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ItemDetails;
