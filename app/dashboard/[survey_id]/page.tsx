"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import { useParams, useRouter } from "next/navigation";
import getSpecificSurvey, {
  getSchoolSurvey,
  postAcademicSurveyAnswers,
  postSchoolSurveyAnswers
} from "@/app/api/surveys/specific";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useSurvey } from "@/components/surveys/surveyContext";
import TeacherSelector from "@/components/surveys/teacherSelector";

interface QuestionOption {
  section: string;
  title: string | null;
  content: string;
  question_type: {
    options: string | null;
    type: string | null;
  };
}

interface SurveyQuestion {
  id: number;
  survey_teacher_question_id: number;
  question: QuestionOption;
}

const SurveyPage = () => {
  const [survey, setSurvey] = useState<SurveyQuestion[]>([]);
  const [studentId, setStudentId] = useState(null);
  const { submitId, setSubmitId } = useSurvey();
  const { schoolId, setSchoolId } = useSurvey()
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<{ [key: number]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [error, setError] = useState("");
  const path = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      setStudentId((session.user as any).student_id);
    }
  }, [session]);

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    const storedSubmitId = localStorage.getItem('submitId');
    const storedSchoolId = localStorage.getItem('schoolId');
    console.log(storedSchoolId, storedSubmitId);


    if (storedSubmitId) setSubmitId(+storedSubmitId);
    if (storedSchoolId) setSchoolId(+storedSchoolId);

  }, [submitId, schoolId]);


  useEffect(() => {
    if (path.survey_id === "school") {
      console.log("school survey fetch");
      const fetchSchoolSurvey = async () => {
        try {
          setLoading(true);
          const data = await getSchoolSurvey();
          setSurvey(data);
          setLoading(false);
          console.log(data);
        } catch (error) {
          setLoading(false);
          setError("Error fetching surveys");
          console.error("Error fetching surveys:", error);
        }
      };
      fetchSchoolSurvey();
    } else {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await getSpecificSurvey(path.survey_id);
          setSurvey(data);
          setLoading(false);
          console.log(data);
        } catch (error) {
          setLoading(false);
          setError("Error fetching surveys");
          console.error("Error fetching surveys:", error);
        }
      };
      fetchData();
    }
  }, [path.survey_id]);

  const handleInput = (key: string | number, value: string) => {
    console.log(`Input Changed - Question ID: ${key}, Value: ${value}`);
    setSelections((prevSelections) => ({
      ...prevSelections,
      [key]: value,
    }));
  };

  const handleSelection = (questionId: number, option: string) => {
    console.log(`Selection Made - Question ID: ${questionId}, Selected Option: ${option}`);
    setSelections((prevSelections) => ({
      ...prevSelections,
      [questionId]: option,
    }));
  };

  useEffect(() => {
    const allSelected = survey.every((q) => {
      if (q.question.question_type.type !== 'select') {
        return true;
      }

      const key = q.survey_teacher_question_id ?? q.id;
      return selections.hasOwnProperty(key);
    });

    setIsSubmitDisabled(!allSelected);
  }, [selections, survey]);

  const checkIfAllRequiredSelected = () => {
    const allSelected = survey.every(q => {
      if (q.question.question_type.type !== 'select') {
        return true;
      }

      return selections[q.survey_teacher_question_id] !== undefined;
    });

    setIsSubmitDisabled(!allSelected);
  };

  const renderOptions = (questionId: string | number, options: string | null, question_type: string) => {
    if (question_type === "select" && options) {
      const optionsArray = JSON.parse(options);
      return optionsArray.map((option: string, index: number) => (
        <button
          key={index}
          type="button"
          className={`rounded-md px-4 ${selections[questionId as number] === option
            ? "bg-zinc-900 text-zinc-100"
            : "border border-zinc-900 text-zinc-900"
            }`}
          onClick={() => handleInput(questionId, option)}
        >
          {option}
        </button>
      ));
    } else if (question_type === "text") {
      return (
        <input
          placeholder="Answer"
          type="text"
          className="bg-transparent w-full md:w-56 border border-transparent px-0.5 border-b-zinc-900"
          value={selections[questionId as number] || ''}
          onChange={(e) => handleInput(questionId, e.target.value)}
        />
      );
    } else {
      return <TeacherSelector onSelect={(value: any) => handleSelection(questionId as number, value)} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const surveyResponses = Object.entries(selections).map(([questionId, answer]) => ({
      student_id: studentId,
      survey_question_id: parseInt(questionId),
      answer: answer,
    }));

    try {
      if (path.survey_id === "school") {
        const schoolPayload: any = {
          student_has_survey_id: schoolId,
          createSurveyAnswerDto: surveyResponses.map(({ student_id, survey_question_id, answer }) => ({
            student_id,
            survey_question_id,
            answer,
          }))
        };
        await postSchoolSurveyAnswers(schoolPayload);
      } else {
        const academicPayload = {
          student_has_survey_teacher: submitId,
          CreateSurveyTeacherAnswerDto: surveyResponses.map(({ student_id, survey_question_id, answer }) => ({
            student_id,
            survey_teacher_question_id: survey_question_id,
            answer,
          }))
        };
        await postAcademicSurveyAnswers(academicPayload);
      }

      console.log("Survey responses submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit survey responses:", error);
    }
  };

  return (
    <div className="w-full min-h-screen mesh1 pt-40 2xl:pt-32 text-sm text-zinc-900 flex justify-center items-center">
      {loading ? (
        <Spinner className="animate-spin" />
      ) : (
        <Container className="w-full py-5 px-5 flex flex-col justify-center">
          {survey.length > 0 && (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-12">
              {survey.map(({ survey_teacher_question_id, question, id }, idx) => (
                <div
                  key={survey_teacher_question_id !== undefined ? survey_teacher_question_id : id}
                  className="mb-4 border-b border-zinc-200 pb-4"
                >
                  <div className="flex md:flex-row flex-col-reverse md:justify-between 2xl:items-center mb-4 w-full">
                    <p className="2xl:text-lg font-medium text-balance 2xl:w-1/2">
                      {question.content}
                    </p>
                    <p className="font-bold border border-zinc-900 px-4 rounded-md mb-4 2xl:mb-0">
                      {question.title}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {renderOptions(
                      survey_teacher_question_id !== undefined ? survey_teacher_question_id : id,
                      question.question_type.options!,
                      question.question_type.type!
                    )}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`border rounded-md px-4 py-1 self-center mt-8 ${isSubmitDisabled ? "border border-zinc-900/50 text-zinc-500 cursor-not-allowed" : "text-zinc-100 bg-zinc-900"}`}
              >
                Submit your answers
              </button>
            </form>
          )}
        </Container>
      )}
    </div>
  );
};

export default SurveyPage;
