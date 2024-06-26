import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import NavigationBar from "./_components/NavigationBar";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Inventory Ark",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col gap-3">
        <NavigationBar />
        <TRPCReactProvider>
          <Toaster />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
