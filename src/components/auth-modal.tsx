import { SignIn, SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AuthModalProps {
  onNavigate: (page: string) => void;
  onLogin?: (user: { name: string; email: string }) => void;
}

export function AuthModal({ onNavigate }: AuthModalProps) {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-4 sm:py-8">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <div className="text-center">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold">Welcome to E-Summit 2026</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to access your dashboard and bookings
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-4 sm:mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm sm:text-base">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <div className="w-full overflow-x-hidden">
                <SignIn 
                  routing="hash"
                  signUpUrl="#signup"
                  appearance={{
                    elements: {
                      rootBox: "w-full mx-auto",
                      card: "shadow-none border-0 w-full p-0 sm:p-2",
                      formButtonPrimary: "text-sm",
                      formFieldInput: "text-sm",
                      footerActionLink: "text-xs sm:text-sm",
                      identityPreviewText: "text-xs sm:text-sm",
                      formFieldLabel: "text-xs sm:text-sm",
                      headerTitle: "text-lg sm:text-xl",
                      headerSubtitle: "text-xs sm:text-sm",
                      socialButtonsBlockButton: "text-xs sm:text-sm",
                      dividerLine: "bg-border",
                      dividerText: "text-xs text-muted-foreground",
                    },
                    layout: {
                      socialButtonsPlacement: "bottom",
                      socialButtonsVariant: "blockButton",
                    },
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              <div className="w-full overflow-x-hidden">
                <SignUp 
                  routing="hash"
                  signInUrl="#login"
                  appearance={{
                    elements: {
                      rootBox: "w-full mx-auto",
                      card: "shadow-none border-0 w-full p-0 sm:p-2",
                      formButtonPrimary: "text-sm",
                      formFieldInput: "text-sm",
                      footerActionLink: "text-xs sm:text-sm",
                      identityPreviewText: "text-xs sm:text-sm",
                      formFieldLabel: "text-xs sm:text-sm",
                      headerTitle: "text-lg sm:text-xl",
                      headerSubtitle: "text-xs sm:text-sm",
                      socialButtonsBlockButton: "text-xs sm:text-sm",
                      dividerLine: "bg-border",
                      dividerText: "text-xs text-muted-foreground",
                    },
                    layout: {
                      socialButtonsPlacement: "bottom",
                      socialButtonsVariant: "blockButton",
                    },
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
