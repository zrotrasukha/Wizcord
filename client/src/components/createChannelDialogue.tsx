import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { MainContext } from '@/routes';

export const CreateChannelDialogue = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();
  const [channelName, setChannelName] = useState<string>('');

  const ctx = useContext(MainContext)
  if (!ctx) throw new Error("Show channel Context doesn't exist");
  const { setShowChannelCreateDialogue } = ctx;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-lg p-0 w-[400px] shadow-xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Channel</CardTitle>
            <CardDescription>
              This is a simple form to create a channel.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <Label htmlFor="channelType" className="text-xs text-gray-700/40">
              Select channel Type
            </Label>
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger
                id="channel-type"
                className="w-full outline-none focus:ring-0 data-[placeholder]:text-gray-500 data-[placeholder]:text-xs"
              >
                <SelectValue placeholder="Channel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="Voice">Voice</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Label htmlFor="channel-name" className="text-xs text-gray-700/40">
              Write your channel Name
            </Label>
            <Input
              id="channel-name"
              placeholder="Your legendary channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowChannelCreateDialogue(false)}
              >
                Cancel
              </Button>
              <Button>Join</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
