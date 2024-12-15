import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { resetPasswordNoCodeSchema } from "@/schemas/auth";
import { ResetPasswordNoCodeValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../lib/api";
import { Alert } from "./ui/alert";
import { LoadingButton } from "./ui/loading-button";
type ResetPasswordFormProps = {
  code: string | null;
  isValid: boolean;
} & React.ComponentPropsWithoutRef<"div">;

export function ResetPasswordForm({
  code,
  isValid,
  className,
  ...props
}: ResetPasswordFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordNoCodeValues>({
    resolver: zodResolver(resetPasswordNoCodeSchema),
    defaultValues: {
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      toast({
        description: "Password changed successfully!",
      });

      navigate("/", {
        replace: true,
      });
    },

    onError: (_: Error) => {
      toast({
        variant: "destructive",
        description: "An error occurred while changing password",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate({ password: data.password, verificationCode: code || "" });
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col gap-2 items-center">
          <QrCode className="text-primary w-20 h-20 text-center" />
          <CardTitle className="text-3xl font-bold">
            Reset your password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isValid ? (
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your new password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoadingButton
                  type="submit"
                  className="w-full"
                  // loading={form.formState.isSubmitting}
                >
                  Submit
                </LoadingButton>

                {/* <div className="text-center text-sm">
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
                </div> */}
              </form>
            </Form>
          ) : (
            <div className="text-center flex flex-col space-y-4">
              <Alert variant="destructive">
                Link is either invalid or has expired
              </Alert>
              <div className="text-center text-sm ">
                Request a new password reset link{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  here
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
