// app/(auth)/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BillwiseLogo from "@/components/billwise-logo";
import axios from "axios";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

export default function RegisterPage() {
  

  const router = useRouter();

  // ----- schema + types ---------------------------------------------------
  const signupSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type SignupFormData = z.infer<typeof signupSchema>;

  // component state
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const parsed = signupSchema.parse(formData);
      try {
        const response = await api.post("/signup", {
          name: parsed.name,
          email: parsed.email,
          password: parsed.password,
        });
        setTimeout(() => {
          toast.success(response.data.header, {
            description: response.data.message,
          });
          router.push("/auth/login");
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          // Axios-specific error
          if (err.response) {
            toast.error(err.response.status, {
              description: err.response.data.message,
            });
            setLoading(false);
          } else if (err.request) {
            // Request was made but no response
            toast.error("No response from server. Please try again later.");
            setLoading(false);
          } else {
            toast.error(err.message);
            setLoading(false);
          }
        } else {
          // Non-Axios error
          toast.error("Unexpected error occurred.");
          setLoading(false);
        }
      }
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
        err.issues.forEach((issue: z.ZodIssue) => {
          const path = issue.path[0] as keyof SignupFormData;
          fieldErrors[path] = issue.message;
        });
        setErrors(fieldErrors);
        console.log("Validation errors:", fieldErrors);
      } else {
        console.error(err);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <BillwiseLogo />
      <form onSubmit={handleSubmitForm}>
        <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
      </form>
    </>
  );
}
