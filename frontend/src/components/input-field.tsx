"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"


const FormSchema = z.object({
  prompt: z
    .string()
    .min(1, { message: "" }),
  model: z
    .string()
})

export function InputField({
  setResult,
}: {
  setResult: (result: any) => void
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: "",
      model: "0",
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {

    fetch("http://127.0.0.1:8000/api/prompter/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Something went wrong.")
      }
      return response.json()
    })
    .then((result) => {
      setResult(result)
    })
    .catch((error) => {
      console.error("Submission error:", error)
    })
  }

  function onClear() {
    form.reset({
      prompt: "",
      model: form.getValues("model"),
    })
    setResult(null) // optionally clear result
  }

  return (
    <div className="relative mb-10">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>  
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your text here..."
                  className="h-64"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end absolute gap-x-1 bottom-1 left-1">  
          <Button
            type="button"
            className="hover:cursor-pointer"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>

        <div className="flex justify-end absolute gap-x-1 bottom-1 right-1">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
              <Select onValueChange={field.onChange} defaultValue="0">
                <FormControl>
                  <SelectTrigger className="hover:cursor-pointer">
                  <SelectValue/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">TCFD-BERT</SelectItem>
                  <SelectItem value="1">Two-Layer SVC</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
            />
            <Button type="submit" className="hover:cursor-pointer">^</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
