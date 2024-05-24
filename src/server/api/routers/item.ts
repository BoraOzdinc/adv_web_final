import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const NON_EMPTY_STRING = z.string().min(1)

export const itemRouter = createTRPCRouter({
    getColor: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.itemColor.findMany({ where: { userId: ctx.session.user.id } })
    }),
    getSize: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.itemSize.findMany({ where: { userId: ctx.session.user.id } })
    }),
    getBrand: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.itemBrand.findMany({ where: { userId: ctx.session.user.id } })
    }),
    getCategory: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.itemCategory.findMany({ where: { userId: ctx.session.user.id } })
    }),
    addSize: protectedProcedure.input(z.object({ sizeCode: NON_EMPTY_STRING, sizeText: NON_EMPTY_STRING })).mutation(async ({ ctx, input: { sizeCode, sizeText } }) => {
        return await ctx.db.itemSize.create({ data: { sizeCode, sizeText, userId: ctx.session.user.id } })
    }),
    addColor: protectedProcedure.input(z.object({ colorCode: NON_EMPTY_STRING, colorText: NON_EMPTY_STRING })).mutation(async ({ ctx, input: { colorCode, colorText } }) => {
        return await ctx.db.itemColor.create({ data: { colorCode, colorText, userId: ctx.session.user.id } })
    }),
    addCategory: protectedProcedure.input(z.object({ name: NON_EMPTY_STRING })).mutation(async ({ ctx, input: { name } }) => {
        return await ctx.db.itemCategory.create({ data: { name, userId: ctx.session.user.id } })
    }),
    addBrand: protectedProcedure.input(z.object({ name: NON_EMPTY_STRING })).mutation(async ({ ctx, input: { name } }) => {
        return await ctx.db.itemBrand.create({ data: { name, userId: ctx.session.user.id } })
    }),
    getItems: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.item.findMany({ where: { userId: ctx.session.user.id }, include: { brand: true, category: true, color: true, itemBarcode: true, size: true } })
    }),
    getItemBarcodesWithId: protectedProcedure.input(z.object({ itemId: NON_EMPTY_STRING })).query(async ({ ctx, input: { itemId } }) => {
        return await ctx.db.itemBarcode.findMany({ where: { itemId, userId: ctx.session.user.id } })
    }),
    addBarcode: protectedProcedure
        .input(
            z.object({
                itemId: NON_EMPTY_STRING,
                barcode: NON_EMPTY_STRING,
                unit: NON_EMPTY_STRING,
                quantity: NON_EMPTY_STRING,
                isMaster: z.boolean(),
            }),
        )
        .mutation(async ({ ctx, input }) => {

            const getBarcode = await ctx.db.itemBarcode.findFirst({
                where: { barcode: input.barcode, userId: ctx.session.user.id },
            });
            if (getBarcode) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "This Barcode Is Used",
                });
            }

            const masterBarcode = await ctx.db.itemBarcode.findFirst({
                where: { isMaster: true, itemId: input.itemId },
            });
            if (input.isMaster && masterBarcode) {
                await ctx.db.itemBarcode.update({
                    where: { id: masterBarcode.id },
                    data: { isMaster: false },
                });
            }
            return await ctx.db.itemBarcode.create({
                data: {
                    barcode: input.barcode,
                    isMaster: input.isMaster,
                    unit: input.unit,
                    quantity: +input.quantity,
                    itemId: input.itemId,
                    userId: ctx.session.user.id
                },
            });
        }),
    updateBarcode: protectedProcedure.input(z.object({
        barcodeId: NON_EMPTY_STRING,
        barcode: NON_EMPTY_STRING,
        unit: NON_EMPTY_STRING,
        quantity: NON_EMPTY_STRING,
        isMaster: z.boolean(),
    })).mutation(async ({ input, ctx }) => {

        const barcode = await ctx.db.itemBarcode.findUnique({ where: { id: input.barcodeId } })
        if (!barcode) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Cannot find Barcode!",
            });
        }
        const masterBarcode = await ctx.db.itemBarcode.findFirst({
            where: { isMaster: true, itemId: barcode.itemId },
        });
        if (input.isMaster && masterBarcode) {
            await ctx.db.itemBarcode.update({
                where: { id: masterBarcode.id },
                data: { isMaster: false },
            });
        }
        return await ctx.db.itemBarcode.update({
            where: { id: input.barcodeId },
            data: {
                barcode: input.barcode,
                isMaster: input.isMaster,
                quantity: Number(input.quantity),
                unit: input.unit
            }
        })
    }),
    getItemWithId: protectedProcedure.input(z.object({ itemId: NON_EMPTY_STRING })).query(async ({ ctx, input: { itemId } }) => {
        return await ctx.db.item.findFirst({
            where: { id: itemId },
            include: {
                brand: true,
                category: true,
                color: true,
                itemBarcode: true,
                size: true,
            }
        })
    }),
    updateItem: protectedProcedure.input(z.object({
        id: NON_EMPTY_STRING,
        itemBrandId: NON_EMPTY_STRING,
        name: NON_EMPTY_STRING,
        itemColorId: NON_EMPTY_STRING,
        itemSizeId: NON_EMPTY_STRING,
        itemCategoryId: NON_EMPTY_STRING
    })).mutation(async ({ ctx, input }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...updatedInput } = input
        await ctx.db.item.update({
            where: { id: input.id },
            data: { ...updatedInput },
        });
    })
})