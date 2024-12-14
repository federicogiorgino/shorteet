import { LoginForm } from "@/components/login-form";
import { QrCode } from "lucide-react";
import { Link } from "react-router-dom";

export function Login() {
  return (
    // <div className="min-h-screen flex items-center justify-center">
    //   <div className="w-full max-w-md space-y-8 p-6 rounded-xl shadow-md">
    //     <div className="flex flex-col items-center">
    //       <QrCode className="w-16 h-16 text-primary" />
    //       <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
    //       <p className="mt-2 text-sm text-muted-foreground">
    //         Please sign in to your account
    //       </p>
    //     </div>

    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
