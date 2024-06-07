import Paths from "@/lib/paths/paths";
import { NextUIProvider } from "@nextui-org/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {

  redirect(Paths.Dashboard)

  return (
    <NextUIProvider>
      <h1>Home Page</h1>
    </NextUIProvider>
  );
}
