"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen mesh4 flex justify-center items-center">
        <Spinner className="" />
      </div>
    );
  }

  return <div className="w-full min-h-screen mesh4">DashboardPage</div>;
};

export default DashboardPage;
