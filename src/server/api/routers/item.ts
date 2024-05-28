import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import QRCode from 'qrcode'

export const NON_EMPTY_STRING = z.string().min(1)

export const itemRouter = createTRPCRouter({
    getItems: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.item.findMany({ where: { userId: ctx.session.user.id }, include: { itemBarcode: true, itemTag: true } })
    }),
    getItemBarcodesWithId: protectedProcedure.input(z.object({ itemId: NON_EMPTY_STRING })).query(async ({ ctx, input: { itemId } }) => {
        return await ctx.db.itemBarcode.findMany({ where: { itemId, userId: ctx.session.user.id } })
    }),
    addBarcode: protectedProcedure
        .input(
            z.object({
                itemId: NON_EMPTY_STRING,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"

            const qrLink = await generateQR(`${baseUrl}/items/${input.itemId}`)

            if (!qrLink) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Barcode couldn't generate!" })

            }
            return await ctx.db.itemBarcode.create({
                data: {
                    itemId: input.itemId,
                    userId: ctx.session.user.id,
                    barcodeQr: qrLink
                },
            });
        }),
    getItemWithId: protectedProcedure.input(z.object({ itemId: NON_EMPTY_STRING })).query(async ({ ctx, input: { itemId } }) => {
        return await ctx.db.item.findFirst({
            where: { id: itemId },
            include: {
                itemBarcode: true,
                itemTag: true
            }
        })
    }),
    updateItem: protectedProcedure.input(z.object({
        id: NON_EMPTY_STRING,
        name: NON_EMPTY_STRING,
        tag: NON_EMPTY_STRING
    })).mutation(async ({ ctx, input }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        await ctx.db.item.update({
            where: { id: input.id },
            data: { name: input.name, itemTagsId: input.tag },
        });
    }),
    getTags: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.itemTags.findMany({ where: { userId: ctx.session.user.id } })
    }),
    addTags: protectedProcedure.input(z.object({ tags: z.string().array() })).mutation(async ({ ctx, input: { tags } }) => {
        await ctx.db.itemTags.deleteMany({ where: { userId: ctx.session.user.id } })
        await ctx.db.itemTags.createMany({ data: tags.map(t => ({ name: t, userId: ctx.session.user.id })) })
    })
})


const generateQR = async (text: string) => {
    return await QRCode.toDataURL(text)
}