import toast from "react-hot-toast";
import { api } from "~/trpc/react";

export const useAddLocation = () => {
  const utils = api.useUtils();
  return api.location.addLocation.useMutation({
    onSuccess: async (_d) => {
      toast.success("Location Added!", { id: "item.addLocation" });
      await utils.location.getLocations.invalidate();
    },
    onMutate: () => {
      toast.loading("Adding Location...", {
        id: "item.addLocation",
      });
    },
    onError(error) {
      toast.error(String(error.data?.zodError ?? error.message), {
        id: "item.addLocation",
      });
    },
  });
};

export const useAddItemToLocation = () => {
  const utils = api.useUtils();
  return api.location.addItemToLocation.useMutation({
    onSuccess: async (_d) => {
      toast.success("Item Added to Location!", { id: "item.addItemLocation" });
      await utils.location.getLocationDetailsWithId.invalidate();
    },
    onMutate: () => {
      toast.loading("Adding Item to Location...", {
        id: "item.addItemLocation",
      });
    },
    onError(error) {
      toast.error(String(error.data?.zodError ?? error.message), {
        id: "item.addItemLocation",
      });
    },
  });
};