    import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type propType = {
    value: string;
    onValueChange: (value: string) => void;
    className?: string; 
}
export default function SelectFieldTab({ value, onValueChange, className }: propType) {
    return (
        <Tabs value={value} onValueChange={onValueChange} className={`w-[400px] flex flex-col justify-center items-center ${className}`}>
            <TabsList>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>
           
        </Tabs>
    )
}
