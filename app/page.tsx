"use client";
import Container from "@/components/ui/container";
import Image from "next/image";
import stBedes from "@/public/st-bedes.svg";
import { useSession } from "next-auth/react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ weight: "variable", subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center mesh2 overflow-y-hidden">
      <Container className="flex flex-col justify-items-center">
        <h2 className={`${manrope.className} text-5xl text-zinc-600`}>
          Inspired, commited, grateful.
        </h2>
      </Container>

      <Image src={stBedes} alt="" className="absolute bottom-0 w-full" />
    </main>
  );
}
