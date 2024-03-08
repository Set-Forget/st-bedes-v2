"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import { useParams, useRouter } from "next/navigation";
import getSpecificSurvey, {
  getSchoolSurvey,
  postAcademicSurveyAnswers,
  postParentSurveyAnswers,
} from "@/app/api/surveys/specific";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useSurvey } from "@/components/surveys/surveyContext";

interface QuestionOption {
  section: string;
  title: string;
  content: string;
  question_type: {
    options: string;
    type: string;
  };
}

interface SurveyQuestion {
  survey_teacher_question_id: number;
  question: QuestionOption;
}

const SurveyPage = () => {
  const [survey, setSurvey] = useState<SurveyQuestion[]>([]);
  const { submitId, setSubmitId } = useSurvey();
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState("");
  const path = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    console.log(submitId, "submitId");

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

  const handleSelection = (questionId: number, option: string) => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      [questionId]: option,
    }));
  };

  const renderOptions = (questionId: number, options: string) => {
    const optionsArray = JSON.parse(options);
    return optionsArray.map((option: string, index: number) => (
      <button
        key={index}
        type="button"
        className={`rounded-md px-4 ${
          selections[questionId] === option
            ? "bg-zinc-900 text-zinc-100"
            : "border border-zinc-900 text-zinc-400"
        }`}
        onClick={() => handleSelection(questionId, option)}
      >
        {option}
      </button>
    ));
  };

  useEffect(() => {
    console.log("Current selections:", selections);
  }, [selections]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const studentId = (session?.user as any).student_id;
    const surveyResponses = Object.entries(selections).map(
      ([questionId, answer]) => ({
        student_id: studentId,
        survey_teacher_question_id: +questionId,
        answer: answer,
      })
    );

    const payload = {
      student_has_survey_teacher: submitId,
      CreateSurveyTeacherAnswerDto: surveyResponses,
    };

    console.log(payload, 'payload');
    
  
    try {
      await postAcademicSurveyAnswers(payload);
      console.log("Survey responses submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to submit survey responses:", error);
    }
  };

  return (
    <div className="w-full min-h-screen mesh1 pt-40 2xl:pt-0 text-zinc-900 flex justify-center items-center">
      {loading ? (
        <Spinner className="animate-spin" />
      ) : (
        <Container className="w-full py-5 flex flex-col justify-center">
          {survey.length > 0 && (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-12">
              {survey.map(({ survey_teacher_question_id, question }, idx) => (
                <div
                  key={survey_teacher_question_id}
                  className="mb-4 border-b border-zinc-200 pb-4"
                >
                  <div className="flex justify-between items-center mb-4 w-full">
                    <p className="text-lg font-medium  text-balance w-1/2">
                      {question.content}
                    </p>
                    <p className="font-bold border border-zinc-900 px-4 rounded-md">
                      {question.title}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {renderOptions(
                      survey_teacher_question_id,
                      question.question_type.options
                    )}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="border text-zinc-100 bg-zinc-900 rounded-md px-4 py-1 self-center mt-8"
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
