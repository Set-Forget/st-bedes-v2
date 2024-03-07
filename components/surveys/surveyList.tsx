import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import Spinner from "../ui/spinner";
import getSurveys from "@/app/api/surveys/all";
import { useSurvey } from "./surveyContext";

const SurveyList = ({ userId }: { userId: any }) => {
  const {surveys, setSurveys} = useSurvey()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const academics = surveys?.academic.student_has_survey_teacher;
  const school = surveys?.school;
  console.log(academics, "academics");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSurveys(userId);
        setSurveys(data);
        setLoading(false);
        console.log(data);
      } catch (error) {
        setLoading(false);
        setError("Error fetching surveys");
        console.error("Error fetching surveys:", error);
      }
    };
    fetchData();
  }, [userId, setSurveys]);

  return (
    <div className="mt-16">
      {loading ? (
        <Spinner className="animate-spin" />
      ) : (
        <Table>
          <TableCaption>Academic surveys</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Teacher</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-zinc-400">
              <TableCell className="font-medium min-w-56">-</TableCell>
              <TableCell>School</TableCell>
              <TableCell>
                {true ? (
                  <span className="t text-zinc-400">Completed</span>
                ) : (
                  <span className="text-amber-500">Pending</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end items-center">
                {/* must change */}
                {true ? (
                  <button disabled className="mr-3">
                    <ArrowUpRightFromSquare className="stroke-zinc-400 cursor-not-allowed" />
                  </button>
                ) : (
                  <Link href="/dashboard/dynamicsurveypage" className="mr-3">
                    <ArrowUpRightFromSquare className="stroke-zinc-900" />
                  </Link>
                )}
              </TableCell>
            </TableRow>
            {academics?.map((item: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-medium min-w-56">
                  {item.survey_teacher.teacher.full_name}
                </TableCell>
                <TableCell>
                  {item.survey_teacher.set.subject.subject_name}
                </TableCell>
                <TableCell>
                  {item.is_answered ? (
                    <span>Completed</span>
                  ) : (
                    <span className="text-amber-500">Pending</span>
                  )}
                </TableCell>
                <TableCell className="flex justify-end items-center">
                  {item.is_answered ? (
                    <button disabled className="mr-3">
                      <ArrowUpRightFromSquare className="stroke-zinc-400 cursor-not-allowed" />
                    </button>
                  ) : (
                    <Link href={`/dashboard/${item.survey_teacher.survey_teacher_id}`} className="mr-3">
                      <ArrowUpRightFromSquare className="stroke-zinc-900" />
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      )}
    </div>
  );
};

export default SurveyList;
