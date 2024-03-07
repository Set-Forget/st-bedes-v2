"use client";
import Container from "@/components/ui/container";
import Image from "next/image";
import stBedes from "@/public/st-bedes.svg";
import { Manrope } from "next/font/google";
import { motion } from "framer-motion";

const manrope = Manrope({ weight: "variable", subsets: ["latin"] });

export default function Home() {
  const words = ["Inspired,", "committed,", "grateful."];
  const container = {
    hidden: {
      y: 15,
    },
    visible: {
      y: 0,
      transition: {
        staggerChildren: 0.5,
        duration: 1
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 3 } },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center mesh2 overflow-y-hidden">
      <Container className="flex flex-col justify-items-center">
        <motion.div
          className={`${manrope.className} text-5xl text-zinc-600`}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span key={index} variants={item}>
              {word}{" "}
            </motion.span>
          ))}
        </motion.div>
      </Container>

      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 w-full"
      >
        <Image src={stBedes} alt="" className=" w-full" />
      </motion.div>
    </main>
  );
}
