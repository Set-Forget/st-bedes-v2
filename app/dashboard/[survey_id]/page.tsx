"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import { useParams } from "next/navigation";
import getSpecificSurvey from "@/app/api/surveys/specific";
import Spinner from "@/components/ui/spinner";

// Assuming the structure of your survey data based on the provided JSON and adjusting types accordingly
interface QuestionOption {
  section: string;
  title: string;
  content: string;
  question_type: {
    options: string; // this is a stringified JSON array
    type: string;
  };
}

interface SurveyQuestion {
  survey_teacher_question_id: number;
  question: QuestionOption;
}

const SurveyPage = () => {
  const [survey, setSurvey] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState("");
  const path = useParams();
  // console.log(path.survey_id, "pathname");

  useEffect(() => {
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
          selections[questionId] === option ? "bg-zinc-900 text-zinc-100" : "border border-zinc-900 text-zinc-400"
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

  return (
    <div className="w-full min-h-screen mesh1 pt-40 2xl:pt-0 text-zinc-900 flex justify-center items-center">
      {loading ? (
        <Spinner className="animate-spin" />
      ) : (
        <Container className="w-full py-5 flex flex-col justify-center">
           {survey.length > 0 && (
            <form className="flex flex-col space-y-12">
              {survey.map(({ survey_teacher_question_id, question }, idx) => (
                <div key={survey_teacher_question_id} className="mb-4 border-b border-zinc-200 pb-4">
                  <div className="flex justify-between items-center mb-4 w-full">
                    <p className="text-lg font-medium  text-balance w-1/2">{question.content}</p>
                    <p className="font-bold border border-zinc-900 px-4 rounded-md">{question.title}</p>
                  </div>
                  <div className="flex space-x-2">
                    {renderOptions(survey_teacher_question_id, question.question_type.options)}
                  </div>
                </div>
              ))}
              <button type="submit" className="border text-zinc-100 bg-zinc-900 rounded-md px-4 py-1 self-center mt-8">Submit your answers</button>
            </form>
          )}
        </Container>
      )}
    </div>
  );
};

export default SurveyPage;
