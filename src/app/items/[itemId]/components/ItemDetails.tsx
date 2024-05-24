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
  itemBrandId: string;
  itemColorId: string;
  itemSizeId: string;
  itemCategoryId: string;
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
  const colors = api.item.getColor.useQuery();
  const sizes = api.item.getSize.useQuery();
  const categories = api.item.getCategory.useQuery();
  const brands = api.item.getBrand.useQuery();

  const form = useForm<FormInput>({
    defaultValues: {
      itemBrandId: itemData?.brand.id,
      name: itemData?.name,
      itemColorId: itemData?.itemColorId,
      itemCategoryId: itemData?.itemCategoryId,
      itemSizeId: itemData?.itemSizeId,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <div className="flex w-full flex-col gap-3">
          <div className=" grid grid-cols-1 gap-3 md:grid-cols-4">
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
              name="itemColorId"
              rules={{ required: true }}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      name={field.name}
                      value={String(field.value)}
                    >
                      <SelectTrigger
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        ref={field.ref}
                        id="itemColorId"
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.data?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.colorCode} - {c.colorText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="itemSizeId"
              rules={{ required: true }}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      name={field.name}
                      value={String(field.value)}
                    >
                      <SelectTrigger
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        ref={field.ref}
                        id="itemSizeId"
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.data?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.sizeCode} - {c.sizeText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="itemCategoryId"
              rules={{ required: true }}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      name={field.name}
                      value={String(field.value)}
                    >
                      <SelectTrigger
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        ref={field.ref}
                        id="itemCategoryId"
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.data?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="itemBrandId"
              rules={{ required: true }}
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1 pt-[0.35rem]">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      name={field.name}
                      value={String(field.value)}
                    >
                      <SelectTrigger
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        ref={field.ref}
                        id="itemBrandId"
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.data?.map((c) => (
                          <SelectItem value={c.id} key={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
