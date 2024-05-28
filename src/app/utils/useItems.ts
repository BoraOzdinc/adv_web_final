import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export const useAddBarcode = () => {
    const utils = api.useUtils();
    return api.item.addBarcode.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Barcode Added", { id: "item.addBarcode" });
            await utils.item.getItemBarcodesWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Barcode...", {
                id: "item.addBarcode",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addBarcode",
            });
        },
    });
};
export const useAddTags = () => {
    const utils = api.useUtils();
    return api.item.addTags.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Tags Added", { id: "item.addTags" });
            await utils.item.getTags.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Tags...", {
                id: "item.addTags",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addTags",
            });
        },
    });
};

export const useUpdateItem = () => {
    const utils = api.useUtils();
    return api.item.updateItem.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Item Edited!", { id: "item.updateItem" });
            await utils.item.getItemWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Item Editing...", {
                id: "item.updateItem",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.updateItem",
            });
        },
    });
};