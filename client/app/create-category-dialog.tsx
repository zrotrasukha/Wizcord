"use client"

import { DialogFooter } from "@/components/ui/dialog"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Hash, Lock, Users } from "lucide-react"

export function CreateCategoryDialog() {
  const [open, setOpen] = React.useState(false)
  const [categoryName, setCategoryName] = React.useState("")
  const [privacy, setPrivacy] = React.useState("everyone")

  const handleCreate = () => {
    console.log("Creating category:", { name: categoryName, privacy })
    setOpen(false)
    setCategoryName("")
    setPrivacy("everyone")
  }

  const handleCancel = () => {
    setOpen(false)
    setCategoryName("")
    setPrivacy("everyone")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Create Category
      </Button>
      <DialogContent className="sm:max-w-[440px] bg-[#313338] border-[#404249] text-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-white">Create Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">
              Category Name
            </Label>
            <Input
              id="category-name"
              placeholder="New Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-[#1e1f22] border-[#404249] text-white placeholder:text-[#87898c] focus-visible:ring-[#5865f2] focus-visible:ring-1 focus-visible:ring-offset-0"
              maxLength={100}
            />
            <div className="text-xs text-[#87898c] text-right">{categoryName.length}/100</div>
          </div>
          <Separator className="bg-[#404249]" />
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase text-[#b5bac1] tracking-wide">Privacy Settings</Label>
              <p className="text-xs text-[#87898c] mt-1">Choose who can view this category and its channels.</p>
            </div>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger className="bg-[#1e1f22] border-[#404249] text-white focus:ring-[#5865f2] focus:ring-1 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2b2d31] border-[#404249]">
                <SelectItem value="everyone" className="text-white hover:bg-[#404249] focus:bg-[#404249]">
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-[#80848e]" />
                    <div>
                      <div className="font-medium">Everyone</div>
                      <div className="text-xs text-[#87898c]">All server members can view this category</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="selected" className="text-white hover:bg-[#404249] focus:bg-[#404249]">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-[#80848e]" />
                    <div>
                      <div className="font-medium">Selected roles and members</div>
                      <div className="text-xs text-[#87898c]">Only selected roles/members can view</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="private" className="text-white hover:bg-[#404249] focus:bg-[#404249]">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-[#80848e]" />
                    <div>
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-[#87898c]">Only you can view this category initially</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-3">
          <Button variant="ghost" onClick={handleCancel} className="text-white hover:bg-[#404249] hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!categoryName.trim()}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white disabled:bg-[#4752c4]/50 disabled:text-white/50"
          >
            Create Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
