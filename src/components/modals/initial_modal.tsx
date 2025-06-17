"use client"
import { Dialog, DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/fileUpload";

export const formSchema = z.object({
  name: z.string().min(1, "Server name is required"),
  imageUrl: z.string().url("Invalid URL").optional(),
});

export default function InitialModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const sumbitHandler = async (data: z.infer<typeof formSchema>) => { console.log(data); };
  const isLoading = form.formState.isSubmitting;
  return (
      <Dialog>
        <DialogTrigger className="border-2 border-black px-2 py-4">Open</DialogTrigger>
        <DialogContent className="dark:bg-gray-100 text-zinc-600">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-black">Customize your server</DialogTitle>
            <DialogDescription className="text-center text-zinc-500">Give your server a npersonality with a name and an image. You can always change it later</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(sumbitHandler)} >
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-shadow-zinc-200 dark:text-zinc-600">Server Image</FormLabel>
                    <FormControl>
                      <FileUpload
                        onChange={(url) => field.onChange(url)}
                        value={field.value}
                        endpoint="serverImage"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-shadow-zinc-200 dark:text-zinc-600">Server Name</FormLabel>
                    <FormControl>
                      <Input className="bg-zinc-100 dark:bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 selection:bg-blue-300" {...field} placeholder="Enter server name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <DialogFooter className="rounded py-4">
                <Button variant={"primary"} >create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  )
}

