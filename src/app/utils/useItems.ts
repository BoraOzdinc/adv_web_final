import toast from "react-hot-toast";
import { api } from "~/trpc/react";


export const useAddSize = () => {
    const utils = api.useUtils();
    return api.item.addSize.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Size Added!", { id: "item.addSize" });
            await utils.item.getSize.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Size...", {
                id: "item.addSize",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addSize",
            });
        },
    });
};
export const useAddColor = () => {
    const utils = api.useUtils();
    return api.item.addColor.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Color Added!", { id: "item.addColor" });
            await utils.item.getColor.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Color...", {
                id: "item.addColor",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addColor",
            });
        },
    });
};
export const useAddCategory = () => {
    const utils = api.useUtils();
    return api.item.addCategory.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Category Added!", { id: "item.addCategory" });
            await utils.item.getCategory.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Category...", {
                id: "item.addCategory",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addCategory",
            });
        },
    });
};
export const useAddBrand = () => {
    const utils = api.useUtils();
    return api.item.addBrand.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Brand Added!", { id: "item.addBrand" });
            await utils.item.getBrand.invalidate()
        },
        onMutate: () => {
            toast.loading("Adding Brand...", {
                id: "item.addBrand",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.addBrand",
            });
        },
    });
};

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

export const useUpdateBarcode = () => {
    const utils = api.useUtils();
    return api.item.updateBarcode.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Barcode Edited!", { id: "item.updateBarcode" });
            await utils.item.getItemBarcodesWithId.invalidate()
        },
        onMutate: () => {
            toast.loading("Barcode Editing...", {
                id: "item.updateBarcode",
            });
        },
        onError(error) {
            toast.error(String(error.data?.zodError ?? error.message), {
                id: "item.updateBarcode",
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