import { basicFetch } from "../fetchFn";

export default async function getSpecificSurvey(id: string | string[]) {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const surveyEndpoint = `${url}/survey/get-question-teacher-by-survey-teacher/${id}`;

  const survey = await basicFetch<any>(surveyEndpoint);
  return survey;
}
