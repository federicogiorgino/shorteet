import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/schemas/auth";
import { LoginValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api";
import { QrCode } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const location = useLocation();
  const redirectUrl = location.state?.redirectUrl || "/";
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      toast({
        description: "Login Success!",
      });
      navigate(redirectUrl, {
        replace: true,
      });
    },
    onError: (_: Error) => {
      toast({
        variant: "destructive",
        description: "There was an error logging in",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col gap-2 items-center">
          <QrCode className="text-primary w-20 h-20 text-center" />
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="-mt-3 text-right text-sm">
                <Link
                  to="/password/forgot"
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Register here
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
