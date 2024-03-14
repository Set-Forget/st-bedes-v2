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
import { CircleDashed } from 'lucide-react';
import { CheckCircleIcon } from 'lucide-react';
import Spinner from "../ui/spinner";
import getSurveys from "@/app/api/surveys/all";
import { useSurvey } from "./surveyContext";
import { useRouter } from "next/navigation";
import SearchBar from "../ui/search";

const SurveyList = ({ userId }: { userId: any }) => {
  const router = useRouter()
  const { surveys, setSurveys } = useSurvey()
  const { submitId, setSubmitId } = useSurvey()
  const { schoolId, setSchoolId } = useSurvey()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const academics = surveys?.academic.student_has_survey_teacher;
  const school = surveys?.school;

  const filteredAcademics = academics?.filter((item: any) => {
    const matchesSearchQuery = item.survey_teacher.set.subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               item.survey_teacher.teacher.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'pending' && !item.is_answered) ||
                          (statusFilter === 'completed' && item.is_answered);
    return matchesSearchQuery && matchesStatus;
  });

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

  const handleRedirect = (item: any) => {
    setSubmitId(item.id);
    router.push(`/dashboard/${item.survey_teacher.survey_teacher_id}`);
  }

  const handleSchoolRedirect = (school: any) => {
    const firstSurvey = school.student_has_survey[0];
    if (firstSurvey) {
      setSchoolId(firstSurvey.id);
      router.push(`/dashboard/school`);
    }
  }


  return (
    <div className="mt-16 min-h-[800px]">
      {loading ? (
        <Spinner className="animate-spin" />
      ) : (

        <>
          <SearchBar onSearch={(query: any) => setSearchQuery(query)}
            onFilterChange={(status: string) => setStatusFilter(status)} />
          <Table className="text-xs 2xl:text-sm">
            <TableCaption>Academic surveys</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="2xl:w-[100px]">Teacher</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-zinc-400">
                <TableCell className="font-medium 2xl:min-w-56">-</TableCell>
                <TableCell>School</TableCell>
                <TableCell>
                  <div className="hidden lg:block">
                    {school && school.student_has_survey && school.student_has_survey.length > 0 && school.student_has_survey[0].is_answered ? (
                      <span className="text-zinc-400">Completed</span>
                    ) : (
                      <span className="text-amber-500">Pending</span>
                    )}
                  </div>
                  <div className="block lg:hidden ml-1.5">
                    {school && school.student_has_survey && school.student_has_survey.length > 0 && school.student_has_survey[0].is_answered ? (
                      <CheckCircleIcon />
                    ) : (
                      <CircleDashed />
                    )}
                  </div>
                </TableCell>
                <TableCell className="flex justify-end items-center">
                  {/* Check if school and student_has_survey exist and it has at least one item */}
                  {school && school.student_has_survey && school.student_has_survey.length > 0 && school.student_has_survey[0].is_answered ? (
                    <button disabled className="mr-3">
                      <ArrowUpRightFromSquare className="stroke-zinc-400 cursor-not-allowed" />
                    </button>
                  ) : (
                    <button onClick={() => school && handleSchoolRedirect(school)} className="mr-3">
                      <ArrowUpRightFromSquare className="stroke-zinc-900" />
                    </button>
                  )}
                </TableCell>

              </TableRow>
              {filteredAcademics?.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium 2xl:min-w-56">
                    {item.survey_teacher.teacher.full_name}
                  </TableCell>
                  <TableCell>
                    {item.survey_teacher.set.subject.subject_name}
                  </TableCell>
                  <TableCell>
                    <div className="hidden  lg:block">
                      {item.is_answered ? (
                        <span className="text-zinc-400">Completed</span>
                      ) : (
                        <span className="text-amber-500">Pending</span>
                      )}
                    </div>
                    <div className="block lg:hidden  ml-1.5">
                      {item.is_answered ? (
                        <CheckCircleIcon />
                      ) : (
                        <CircleDashed />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="flex justify-end items-center">
                    {item.is_answered ? (
                      <button disabled className="mr-3">
                        <ArrowUpRightFromSquare className="stroke-zinc-400 cursor-not-allowed" />
                      </button>
                    ) : (
                      <a onClick={() => handleRedirect(item)} className="mr-3 cursor-pointer">
                        <ArrowUpRightFromSquare className="stroke-zinc-900" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </>
      )}
    </div>
  );
};

export default SurveyList;
