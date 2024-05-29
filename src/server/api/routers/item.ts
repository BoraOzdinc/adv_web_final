import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import QRCode from "qrcode";

export const NON_EMPTY_STRING = z.string().min(1);

export const itemRouter = createTRPCRouter({
  addItem: protectedProcedure
    .input(z.object({ name: NON_EMPTY_STRING, tag: NON_EMPTY_STRING }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.item.create({
        data: {
          name: input.name,
          itemTagsId: input.tag,
          userId: ctx.session.user.id,
        },
      });
    }),
  getItems: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.item.findMany({
      where: { userId: ctx.session.user.id },
      include: { itemBarcode: true, itemTag: true },
    });
  }),
  getItemWithName: protectedProcedure
    .input(z.object({ name: NON_EMPTY_STRING }))
    .query(async ({ ctx, input: { name } }) => {
      return await ctx.db.item.findMany({
        where: {
          name: { contains: name, mode: "insensitive" },
          userId: ctx.session.user.id,
        },
      });
    }),
  getItemBarcodesWithId: protectedProcedure
    .input(z.object({ itemId: NON_EMPTY_STRING }))
    .query(async ({ ctx, input: { itemId } }) => {
      return await ctx.db.itemBarcode.findMany({
        where: { itemId, userId: ctx.session.user.id },
      });
    }),
  addBarcode: protectedProcedure
    .input(
      z.object({
        itemId: NON_EMPTY_STRING,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const qrLink = await generateQR(`${baseUrl}/items/${input.itemId}`);

      if (!qrLink) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Barcode couldn't generate!",
        });
      }
      return await ctx.db.itemBarcode.create({
        data: {
          itemId: input.itemId,
          userId: ctx.session.user.id,
          barcodeQr: qrLink,
        },
      });
    }),
  getItemWithId: protectedProcedure
    .input(z.object({ itemId: NON_EMPTY_STRING }))
    .query(async ({ ctx, input: { itemId } }) => {
      return await ctx.db.item.findFirst({
        where: { id: itemId },
        include: {
          itemBarcode: true,
          itemTag: true,
        },
      });
    }),
  updateItem: protectedProcedure
    .input(
      z.object({
        id: NON_EMPTY_STRING,
        name: NON_EMPTY_STRING,
        tag: NON_EMPTY_STRING,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      await ctx.db.item.update({
        where: { id: input.id },
        data: { name: input.name, itemTagsId: input.tag },
      });
    }),
  getTags: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.itemTags.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
  addTags: protectedProcedure
    .input(z.object({ tags: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id; // Replace with actual user ID from ctx
      const prisma = ctx.db;
      // 1. Check for existing tags
      const existingTags = await prisma.itemTags.findMany({
        where: { userId, name: { in: input.tags } },
      });

      // 2. Identify new tags to create
      const newTags = input.tags.filter(
        (tagName) =>
          !existingTags.some((existingTag) => existingTag.name === tagName),
      );

      // 3. Identify tags to delete (exclude tags used by items)
      const tagsToDelete: { id: string; name: string; userId: string; }[] = [];
      for (const existingTag of existingTags) {
        const itemUsingTag = await prisma.item.findFirst({
          where: {
            itemTagId: existingTag.id, // Use itemTagId here, not existingTag.itemTagId
          },
        });

        // Add to deletion list ONLY if not used and not in input tags
        if (!itemUsingTag && !input.tags.includes(existingTag.name)) {
          tagsToDelete.push(existingTag);
        }
      }

      // 4. Perform database operations within a transaction
      await prisma.$transaction(async (prisma) => {
        // Create new tags
        await Promise.all(
          newTags.map((tagName) =>
            prisma.itemTags.create({
              data: {
                name: tagName,
                user: { connect: { id: userId } },
              },
            }),
          ),
        );

        // Delete unused tags
        await prisma.itemTags.deleteMany({
          where: { id: { in: tagsToDelete.map((tag) => tag.id) } },
        });
      });

      return { success: true };
    }),
});

export const generateQR = async (text: string) => {
  return await QRCode.toDataURL(text);
};

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
