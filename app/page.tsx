import Container from "@/components/ui/container";
import Image from "next/image";
import stBedes from "@/public/st-bedes.svg";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 mesh4">
      <Container className="flex flex-col justify-items-center">
        <h2 className="text-3xl text-zinc-600">
          Inspired, commited, grateful.
        </h2>
      </Container>

      <Image src={stBedes} alt="" className="absolute -bottom-2" />
    </main>
  );
}
