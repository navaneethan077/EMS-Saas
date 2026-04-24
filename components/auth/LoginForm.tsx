"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Mock authentication logic
    setTimeout(() => {
      if (values.email === "admin@ems.com" && values.password === "admin123") {
        login(values.email);
        toast.success("Login successful!", {
          description: "Welcome back to the EMS Super Admin dashboard.",
        });
        // router.push("/dashboard") is handled by AuthProvider's useEffect
      } else {
        toast.error("Invalid credentials", {
          description: "Please check your email and password and try again.",
        });
        setIsLoading(false);
      }
    }, 1500);
  }

  return (
    <div className="grid gap-6">
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="admin@ems.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10"
                  {...form.register("email")}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" className="px-0 font-normal text-xs h-auto" type="button">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Mock Credentials
              </span>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
            <p>Email: <span className="font-mono font-medium text-foreground">admin@ems.com</span></p>
            <p>Password: <span className="font-mono font-medium text-foreground">admin123</span></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
