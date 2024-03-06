"use client";
import React from "react";
import Link from "next/link";
import Container from "./container";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const { data: session, status } = useSession();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="fixed top-0 py-8 flex w-full">
      <Container className="flex w-full justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          St Bede&apos;s
        </Link>
        <ul className="space-x-4 flex justify-center items-center">
          {session ? (
            <>
              <li>
                <Link
                  href="/dashboard"
                  className="group transition duration-300 animate-fade-in font-semibold"
                >
                  Dashboard
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-zinc-900"></span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="font-semibold group transition duration-300 animate-fade-in"
                >
                  Sign out
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-zinc-900"></span>
                </button>
              </li>
              <li>
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full ring-2 ring-zinc-200 capitalize text-zinc-400 font-black flex justify-center items-center">
                    @
                  </div>
                )}
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="font-semibold group transition duration-300 animate-fade-in"
              >
                Sign in
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[1px] bg-zinc-900"></span>
              </Link>
            </li>
          )}
        </ul>
      </Container>
    </div>
  );
};

export default Navbar;
