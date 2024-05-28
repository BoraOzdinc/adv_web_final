import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { NON_EMPTY_STRING } from "./item";


export const locationRouter = createTRPCRouter({
    getLocations: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.location.findMany({ where: { userId: ctx.session.user.id }, include: { items: true } })
    }),
    getLocationDetailsWithId: protectedProcedure.input(z.object({ locationId: NON_EMPTY_STRING })).query(async ({ ctx, input: { locationId } }) => {
        return await ctx.db.location.findFirst({ where: { id: locationId, userId: ctx.session.user.id }, include: { items: { include: { item: true } } } })
    }),
    addLocation: protectedProcedure.input(z.object({ name: NON_EMPTY_STRING })).mutation(async ({ ctx, input: { name } }) => {
        return await ctx.db.location.create({ data: { name, userId: ctx.session.user.id } })
    })
})