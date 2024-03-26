"use client";
import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter, useSearchParams } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = useSearchParams().get("error");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const result = await signIn("credentials", {
      redirect: true,
      email: email,
      password: password,
    });
    if (result?.error) {
      console.error(result.error);
      console.log(result, "result");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form onSubmit={handleSubmit} className="w-64 space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            required
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-rose-500 text-xs text-balance">
            Hmmm... Your credentials are wrong, please try again.
          </p>
        )}
        <button
          type="submit"
          className="flex justify-center items-center h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="font-semibold">Sign in</span>
        </button>
      </form>
    </Suspense>
  );
};

export default LoginForm;
