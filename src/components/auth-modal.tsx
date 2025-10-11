import { SignIn, SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AuthModalProps {
  onNavigate: (page: string) => void;
  onLogin?: (user: { name: string; email: string }) => void;
}

export function AuthModal({ onNavigate }: AuthModalProps) {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Welcome to E-Summit 2026</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard and bookings
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <SignIn 
                routing="hash"
                signUpUrl="#signup"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0",
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <SignUp 
                routing="hash"
                signInUrl="#login"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0",
                  },
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
