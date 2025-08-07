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
import { useContext, useState } from "react"
import { X } from "lucide-react"
import { MainContext } from "@/providers/MainContext"
import { useApi } from "@/hooks/useApi"

interface CreateCategoryProps {
  onComplete: () => void;
  onCancel: () => void;
  refreshCategories: () => Promise<void>;
}

export default function CreateCategory({
  onComplete,
  onCancel,
  refreshCategories,
}: CreateCategoryProps) {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const ctx = useContext(MainContext);
  if (!ctx) throw new Error("MainContext is not available");

  const { serverId } = ctx;

  const api = useApi();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!api) return;
    setIsLoading(true);

    try {
      const res = await api.category.create.$post({
        json: {
          name: categoryName,
          serverId: serverId,
        }
      })

      if (!res.ok) {
        console.error("Failed to create category:", res.statusText);
        return;
      }

      await res.json();
      await refreshCategories();

      onComplete();
    } catch (err) {
      console.error("Error creating category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
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
              Create a new category to organize your channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="categoryName"
                    className="font-semibold text-black/70 uppercase text-xs"
                  >
                    CATEGORY NAME
                  </Label>
                  <Input
                    id="categoryName"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button
              variant="outline"
              className="w-1/2"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="w-1/2"
              disabled={!categoryName.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
