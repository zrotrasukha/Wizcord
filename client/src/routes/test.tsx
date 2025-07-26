import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import SelectFieldTab from '@/components/ui/selectFieldTab'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})
function RouteComponent() {
  const [tabField, setTabField] = useState('join');
  return (
    <div className='bg-zinc-900 h-screen flex items-center justify-center'>
      <Card className='flex flex-col w-[400px] h-fit justify-center items-center'>
        <div className='flex flex-col w-full p-4 justify-center items-center'>
          <p>text</p>
          <SelectFieldTab value={tabField} onValueChange={setTabField} />
        </div>
      </Card>

    </div >
  );
}

