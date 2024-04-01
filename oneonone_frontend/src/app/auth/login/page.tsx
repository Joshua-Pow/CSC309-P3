"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUser } from "@/lib/axiosUtil";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(
      /^[a-zA-Z0-9@.+_-]+$/,
      "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
    ),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginUser = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    try {
      const response = await loginUser(values);
      const { access, refresh, ...userDetails } = response.data;

      login(access, refresh, userDetails);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen w-full lg:grid  lg:grid-cols-2 ">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <Link
          href="/"
          className="relative z-20 flex items-center text-lg font-medium"
        >
          1on1
        </Link>
        <div className="relative z-20 mt-auto">
          <footer className="text-sm font-medium">
            Made with ❤️ by Joshua Pow, Tashan Maniyalaghan, Jongjin Jung, and
            Asher Hounsell
          </footer>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to login to your account
            </p>
          </div>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id={field.name}
                        placeholder="max_robinson"
                        required
                      />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <FormControl>
                      <Input {...field} id={field.name} type="password" />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-4 w-full">
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
