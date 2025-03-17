//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import Title from "../../_components/Title";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

type FormData = {
  username: string;
  password: string;
};

export default function CustomLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status

  // Redirect to dashboard if the user is already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const onSubmit = async (data: FormData) => {
    const result = await signIn("credentials", {
      email: data.username,
      password: data.password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      // Successfully logged in, now redirect manually
      toast.success("Login successful!");
      router.push("/dashboard"); // Redirect to the callback URL directly
      router.refresh();
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-green-700">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <Title />
        <h1 className="text-lg font-semibold my-2 text-gray-800">Login</h1>

        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          className="w-full mt-4 bg-green-700 hover:bg-green-500 text-white font-semibold"
          type="submit"
        >
          Login
        </Button>
        <div className="mt-3 text-xs">
          <Link href={"/register"}>Register</Link>
        </div>
      </form>
    </div>
  );
}
