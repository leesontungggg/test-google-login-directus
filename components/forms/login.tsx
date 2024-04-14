"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { AlertCircle, Spinner } from "../icons"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "../ui/alert"

const formSchema = z.object({
  email: z.string().email({
    message: "Email is required.",
  }),
  password: z.string().nonempty({ message: "Password is required" }),
})

export default function LoginForm() {
  let openedWindow: any
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (
    values: z.infer<typeof formSchema>
  ): Promise<void> => {
    setIsLoading(true)
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      callbackUrl: `/`,
      redirect: false,
    })
    if (res?.error) {
      setError(res?.error)
      setIsLoading(false)
    } else {
      router.push("/")
    }
  }

  const handleGoogleLogin = async () => {
    openedWindow = window.opener(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/auth/login/google`
    )

    let timer = setInterval(function () {
      console.log("openedWindow", openedWindow.location)
      if (openedWindow.closed) {
        clearInterval(timer)
        alert("closed")
      }
    }, 1000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <div className="grid gap-1">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs italic">
                  Enter your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-1">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*******" {...field} />
                </FormControl>
                <FormDescription className="text-xs italic">
                  Enter your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button disabled={isLoading} type="submit">
          {isLoading && <Spinner />} Login
        </Button>
        <a href="https://tramdot.up.railway.app/auth/login/google?redirect=http://localhost:3000/">
          Google Login
        </a>
      </form>
    </Form>
  )
}
