import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { baseUrl, generateQR, NON_EMPTY_STRING } from "./item";

export const locationRouter = createTRPCRouter({
  getLocations: protectedProcedure.query(async ({ ctx }) => {
    const locationList = await ctx.db.location.findMany({
      where: { userId: ctx.session.user.id },
      include: { items: true },
    });
    return await Promise.all(
      locationList.map(async (location) => ({
        ...location,
        qrLink: await generateQR(`${baseUrl}/layout/${location.id}`),
      })),
    );
  }),
  getLocationDetailsWithId: protectedProcedure
    .input(z.object({ locationId: NON_EMPTY_STRING }))
    .query(async ({ ctx, input: { locationId } }) => {
      return await ctx.db.location.findFirst({
        where: { id: locationId, userId: ctx.session.user.id },
        include: { items: { include: { item: true } } },
      });
    }),
  addLocation: protectedProcedure
    .input(z.object({ name: NON_EMPTY_STRING }))
    .mutation(async ({ ctx, input: { name } }) => {
      return await ctx.db.location.create({
        data: { name, userId: ctx.session.user.id },
      });
    }),
  addItemToLocation: protectedProcedure
    .input(
      z.object({
        locationId: NON_EMPTY_STRING,
        itemId: NON_EMPTY_STRING,
        quantity: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input: { locationId, itemId, quantity } }) => {
      const locationDetails = await ctx.db.locationItemDetail.findFirst({
        where: { locationId, itemId, userId: ctx.session.user.id },
      });
      if (!locationDetails) {
        return await ctx.db.locationItemDetail.create({
          data: { quantity, locationId, itemId, userId: ctx.session.user.id },
        });
      }
      return await ctx.db.locationItemDetail.update({
        where: { id: locationDetails.id },
        data: { quantity: locationDetails.quantity + quantity },
      });
    }),
  updateLocationDetails: protectedProcedure.input(z.object({ locationItemDetailId: NON_EMPTY_STRING, quantity: z.number().min(0) })).mutation(async ({ ctx, input: { locationItemDetailId, quantity } }) => {
    if (quantity === 0) {
      return await ctx.db.locationItemDetail.delete({ where: { id: locationItemDetailId } })
    }
    return await ctx.db.locationItemDetail.update({ where: { id: locationItemDetailId }, data: { quantity } })
  })
});
