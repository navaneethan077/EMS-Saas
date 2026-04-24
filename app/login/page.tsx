import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | EMS Super Admin",
  description: "Login to your account to manage your enterprise.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Login Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/40 to-slate-950/80" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-3 rounded-2xl shadow-xl mb-4 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/LOGO.png"
              alt="EMS Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EMS SaaS</h1>
          <p className="text-slate-400 text-sm mt-1">Super Admin Dashboard</p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Contact Support
          </Link>
        </p>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-6 left-0 w-full text-center text-slate-500 text-xs z-10">
        &copy; {new Date().getFullYear()} ELoop Project. All rights reserved.
      </div>
    </div>
  );
}
