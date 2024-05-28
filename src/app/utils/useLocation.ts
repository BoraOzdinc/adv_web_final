import toast from "react-hot-toast";
import { api } from "~/trpc/react";



export const useAddLocation = () => {
    const utils = api.useUtils();
    return api.location.addLocation.useMutation({
        onSuccess: async (_d,) => {
            toast.success("Location Added!", { id: "item.addLocation" });
            await utils.location.getLocations.invalidate()
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