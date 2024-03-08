import { basicFetch } from "../fetchFn";

export default async function getSurveys(id: string) {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const academicEndpoint = `${url}/survey-teacher/get-survey-teacher-by-student/${id}`;
  const schoolEndpoint = `${url}/survey/get-survey-student`;

  const academic = await basicFetch<any>(academicEndpoint);
  const school = await basicFetch<any>(schoolEndpoint);

  // console.log(school, academic, 'data in fetch');

  return {
    academic,
    school,
  };
}
