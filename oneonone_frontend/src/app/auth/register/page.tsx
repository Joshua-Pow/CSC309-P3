"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { registerUser } from "@/lib/axiosUtil";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const registerSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    username: z
      .string()
      .min(1)
      .regex(
        /^[a-zA-Z0-9@.+_-]+$/,
        "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
      ),
    email: z.string().email(),
    password: z.string().min(8),
    password2: z.string().min(8),
  })
  .refine((data) => data.password === data.password2, {
    path: ["password2"],
    message: "Passwords do not match",
  });

export type RegisterUser = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const registerForm = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    console.log(values);

    const res = await registerUser(values).catch((err) =>
      toast.error(err.response.data.non_field_errors.join(" ")),
    );
    if (res.status === 201) {
      toast.success("User registered successfully");
      router.push("/auth/login");
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
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={registerForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>First name</FormLabel>
                      <FormControl>
                        <Input {...field} id={field.name} placeholder="Max" />
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={field.name}>Last name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="Robinson"
                          required
                        />
                      </FormControl>
                      <FormMessage {...field} />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={registerForm.control}
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
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        placeholder="email@example.com"
                        required
                      />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
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
              <FormField
                control={registerForm.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Confirm password</FormLabel>
                    <FormControl>
                      <Input {...field} id={field.name} type="password" />
                    </FormControl>
                    <FormMessage {...field} />
                  </FormItem>
                )}
              />

              <Button type="submit" className="mt-4 w-full">
                Register
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
