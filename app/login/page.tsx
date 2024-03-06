"use client";
import React from "react";
import { signIn } from "next-auth/react";
import Container from "@/components/ui/container";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const onSubmit = async (e: any) => {
    e.preventDefault();
    await signIn("google");
  };

  return (
    <div className="mesh3 min-h-screen">
      <Container className="py-32">
        <form action="#" onSubmit={onSubmit}>
          <button>Sign in with Google</button>
        </form>
        <LoginForm />
      </Container>
    </div>
  );
};

export default LoginPage;
