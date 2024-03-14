import { Input } from "./input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SearchBar = ({ onSearch, onFilterChange } : {onSearch: any, onFilterChange: any}) => {
    
    const handleValueChange = (value: any) => {
        onFilterChange(value);
    };

    return (
        <div className="flex gap-5 mb-8">
            <Input
              placeholder="Search by name..."
              type="text"
              className="w-80"
              onChange={(e) => onSearch(e.target.value)} 
            />
            <Select onValueChange={onFilterChange}>
                <SelectTrigger className="w-44">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}


export default SearchBar