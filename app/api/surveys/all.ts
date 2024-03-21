import { basicFetch } from "../fetchFn";

export default async function getSurveys(id: string) {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const academicEndpoint = `${url}/survey-teacher/get-survey-teacher-by-student/${id}`;
  const schoolEndpoint = `${url}/survey/get-school-survey-by-student/${id}`;

  const academic = await basicFetch<any>(academicEndpoint);
  const school = await basicFetch<any>(schoolEndpoint);

  return {
    academic,
    school,
  };
}
