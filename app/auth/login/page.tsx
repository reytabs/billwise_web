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
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", {
        email: email,
        password: password,
      });
      setTimeout(() => {
        toast.success(response.data.header, {
          description: response.data.message,
        });
        const user = {
          name: response.data.name,
          email: response.data.email,
        };
        // store basic user data
        localStorage.setItem("userData", JSON.stringify(user));
        // store token if returned by the API
        const token =
          response.data.token ||
          response.data.accessToken ||
          response.data?.data?.token;
        if (token) {
          localStorage.setItem("accessToken", token);
        }
        router.push("/dashboard");
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        // Axios-specific error
        if (err.response) {
          toast.error(err.response.data.error, {
            description: err.response.data.message,
          });
          setLoading(false);
        } else if (err.request) {
          // Request was made but no response
          console.log("No response from server. Please try again later.");
          setLoading(false);
        } else {
          // Something else happened
          console.log(`Request error: ${err.message}`);
          setLoading(false);
        }
      } else {
        // Non-Axios error
        console.log("Unexpected error occurred.");
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={handleEmailChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              onChange={handlePasswordChange}
            />
          </div>
          <Button className="w-full" disabled={loading} type="submit">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div> */}

          {/* <Button variant="outline" className="w-full">
          Google
        </Button> */}

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </form>
  );
}
