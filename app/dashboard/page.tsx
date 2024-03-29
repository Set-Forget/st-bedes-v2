"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import Container from "@/components/ui/container";
import SurveyList from "@/components/surveys/surveyList";
import SearchBar from "@/components/ui/search";

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
        <Spinner className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mesh2 pt-40 2xl:pt-32 text-zinc-900 flex justify-start items-center">
      <Container className="w-full flex flex-col justify-center px-5">
        <div className="flex space-x-2 text-xl md:justify-start justify-center md:text-3xl">
          <p>Welcome back, </p>{" "}
          <p className="capitalize font-black">
            {session?.user?.name || (session?.user as any).fullname}
          </p>
        </div>
        <p className="text-xl text-center md:text-start md:text-2xl text-zinc-600">Select a survey to get started</p>
        <SurveyList userId={(session?.user as any).student_id} />
      </Container>
    </div>
  );
};

export default DashboardPage;
