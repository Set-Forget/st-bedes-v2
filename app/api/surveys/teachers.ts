import { basicFetch } from "../fetchFn";

export async function getStudentTeachers({ studentId }: { studentId: any }) {
    const url = process.env.NEXT_PUBLIC_BACK_URL as string;
    const teachers = `${url}/survey-teacher/teacher-list-by-student/${studentId}`;

    const survey = await basicFetch<any>(teachers);
    return survey;
}