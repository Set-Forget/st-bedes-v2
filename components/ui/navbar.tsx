import React from "react";
import Link from "next/link";
import Container from "./container";

const Navbar = () => {
  return (
    <div className="fixed top-0 py-8 flex w-full">
      <Container className="flex w-full justify-between items-center">
        <Link href='/' className="font-bold text-xl">St Bede&apos;s</Link>
        <ul>
          <li>
            <Link href="/login" className="font-semibold">Sign in</Link>
          </li>
        </ul>
      </Container>
    </div>
  );
};

export default Navbar;
