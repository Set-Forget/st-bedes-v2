import { basicFetch } from "../fetchFn";

export default async function getSpecificSurvey(id: string | string[]) {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const surveyEndpoint = `${url}/survey-teacher/get-question-teacher-by-survey-teacher/${id}`;

  const survey = await basicFetch<any>(surveyEndpoint);
  return survey;
}

export async function getSchoolSurvey() {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const schoolSurveyEndpoint = `${url}/survey/get-survey-student`;

  const survey = await basicFetch<any>(schoolSurveyEndpoint);
  return survey;
}

export async function postAcademicSurveyAnswers(payload: {
  student_has_survey_teacher: number | null;
  CreateSurveyTeacherAnswerDto: {
    student_id: any;
    survey_teacher_question_id: number;
    answer: string;
  }[];
}) {
  const url = process.env.NEXT_PUBLIC_BACK_URL as string;
  const surveyEndpoint = `${url}/survey-teacher/add-answer-teacher`;
  const response = await fetch(surveyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_has_survey_teacher: payload.student_has_survey_teacher,
      CreateSurveyTeacherAnswerDto: payload.CreateSurveyTeacherAnswerDto,
    }),
  });

  if (!response.ok) {
    const body = ({
      student_has_survey_teacher: payload.student_has_survey_teacher,
      CreateSurveyTeacherAnswerDto: payload.CreateSurveyTeacherAnswerDto,
    });
    console.log(body);

    throw new Error("Failed to submit survey responses");
  }
}

export async function postSchoolSurveyAnswers(
  studentId: string | number,
  surveyQuestionIds: string[] | number[],
  answers: string[]
) {
  // post body: [{
  //   studentId: num,
  //   surveyQuestionId: num,
  //   answer: string
  // },]
}
export async function postParentSurveyAnswers(
  studentId: string | number,
  ParentSurveyQuestionIds: string[] | number[],
  answers: string[]
) {
  // post body: [{
  //   studentId: num,
  //   ParentSurveyQuestionId: num,
  //   answer: string
  // },]
}
