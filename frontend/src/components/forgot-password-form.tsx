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
import { forgotEmailSchema } from "@/schemas/auth";
import { ForgotEmailValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "../lib/api";
import { LoadingButton } from "./ui/loading-button";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { toast } = useToast();

  const form = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: sendPasswordResetEmail,
    onSuccess: async () => {
      toast({
        description: "Email sent! Check your inbox for further instructions.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data.email);
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col gap-2 items-center">
          <QrCode className="text-primary w-20 h-20 text-center" />
          <CardTitle className="text-3xl font-bold">
            Forgot your password
          </CardTitle>
          <CardDescription>Enter your email address</CardDescription>
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

              <LoadingButton
                type="submit"
                className="w-full"
                loading={form.formState.isSubmitting}
              >
                Submit
              </LoadingButton>

              <div className="text-center text-sm">
                Back to{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Register
                </Link>{" "}
                or{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
