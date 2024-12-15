import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { verifyEmail } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";

export function VerifyEmail() {
  const { code } = useParams<{ code: string }>();

  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code),
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-lg font-medium">Verifying your email...</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <XCircle className="w-16 h-16 text-red-500" />
                <p className="text-xl font-semibold text-red-500">
                  An error occurred
                </p>
                <p className="text-gray-600 text-center">
                  We couldn't verify your email. Please try again later or
                  contact support.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                {isSuccess ? (
                  <>
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <p className="text-xl font-semibold text-green-500">
                      Email Verified!
                    </p>
                    <p className="text-gray-600 text-center">
                      Thank you for verifying your email. You can now close this
                      page.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 text-red-500" />
                    <p className="text-xl font-semibold text-red-500">
                      Invalid Link
                    </p>
                    <p className="text-gray-600 text-center">
                      The verification link is invalid or has expired. Please
                      request a new one.
                    </p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
