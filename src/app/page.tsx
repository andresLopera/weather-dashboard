import Paths from "@/lib/paths/paths";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {

  redirect(Paths.Dashboard)

  return (
    <h1>Home Page</h1>
  );
}
