"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Container from "@/components/ui/container";
import LoginForm from "@/components/auth/LoginForm";
import googleIcon from "@/public/icons/googleIcon.svg";
import Image from "next/image";

const LoginPage = () => {
  const onSubmit = async (e: any) => {
    e.preventDefault();
    await signIn("google");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center mesh1">
      <Container className="flex flex-col justify-center items-center">
        <div className="bg-white/40 backdrop-blur-2xl px-8 2xl:px-28 py-14 flex flex-col space-y-6 justify-center items-center rounded-xl border-zinc-100 border">
          <form action="#" onSubmit={onSubmit} className="">
            <button className="flex font-semibold justify-center items-center h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
              <Image src={googleIcon} alt="" className="w-6 mr-4" />
              Sign in with Google
            </button>
          </form>
          <LoginForm />
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
