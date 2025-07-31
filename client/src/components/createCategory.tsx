import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, type MouseEvent } from "react"
import { X } from "lucide-react"
interface CreateCategoryProps {
    onComplete: () => void;
    onCancel: () => void;
}

export default function CreateCategory({ onComplete, onCancel }: CreateCategoryProps) {
    const [categoryName, setCategoryName] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (categoryName.trim()) {
            console.log("Creating category:", categoryName);
            onComplete();
        }
    }

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    }
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={handleBackgroundClick}
        >
            <div className="h-fit w-[400px]">
                <Card className="w-full h-full bg-white relative">
                    <CardHeader>
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <CardTitle>Create Category</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="categoryName"
                                        className="font-semibold text-black/70 uppercase text-xs">
                                        CATEGORY NAME
                                    </Label>
                                    <Input
                                        id="categoryName"
                                        type="text"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        placeholder="Enter category name"
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button variant={"outline"}
                            className="w-1/2"
                            onClick={onCancel}
                        >Cancel</Button>
                        <Button type="submit" className="w-1/2">
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}
