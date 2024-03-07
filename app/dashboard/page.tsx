"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import Container from "@/components/ui/container";
import SurveyList from "@/components/surveys/surveyList";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  console.log(session, "session");
  

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
      <div className="w-full min-h-screen mesh2 flex justify-center items-center">
        <Spinner className="" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mesh2 text-zinc-900 flex justify-center items-center">
      <Container className="w-full flex flex-col justify-center">
        <div className="flex space-x-2 text-3xl">
          <p>Welcome back, </p> <p className="capitalize font-black">{session?.user?.name}</p>
        </div>
        <p className="text-2xl text-zinc-600">Select a survey to get started</p>
        <SurveyList/>
      </Container>
    </div>
  );
};

export default DashboardPage;
