import { getStudentTeachers } from "@/app/api/surveys/teachers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const TeacherSelector = ({ onSelect }: { onSelect: any }) => {
    const { data: session } = useSession()
    const [teachers, setTeachers] = useState<string[]>([])
    const studentId = (session?.user as any).student_id;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStudentTeachers({ studentId })
            setTeachers(data)
        }
        fetchData();
    }, [studentId]);

    const handleSelect = (value: any) => {
        onSelect(value);
    }

    return (
        <Select required onValueChange={handleSelect}>
            <SelectTrigger className="w-56">
                <SelectValue placeholder="Select a teacher" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Teachers</SelectLabel>
                    {teachers.map((teacher, idx) => (
                        <SelectItem key={idx} value={teacher}>{teacher}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}


export default TeacherSelector;