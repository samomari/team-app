"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthCard() {
  const [variant, setVariant] = useState<"login" | "register">("login");

  const content = {
    login: {
      title: "Login",
      component: <LoginForm />,
      headerText: "Login to your account",
      footerText: "Don`t have an account?",
      buttonText: "Register",
    },
    register: {
      title: "Register",
      component: <RegisterForm />,
      headerText: "Create an account",
      footerText: "Already have an account?",
      buttonText: "Login",
    },
  };

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login",
    );
  }, []);

  return (
    <Card className="max-w-[400px] w-full shadow-md">
      <CardHeader className="w-full flex flex-col gap-y-4 items-center justify-center">
        <h1 className="text-3xl font-semibold">{content[variant].title}</h1>
        <p className="text-muted-foreground text-sm">
          {content[variant].headerText}
        </p>
      </CardHeader>
      <CardContent>{content[variant].component}</CardContent>
      <CardFooter className="w-full flex flex-col items-center">
        <p className="text-neutral-500 text-sm">
          {content[variant].footerText}
          <Button
            onClick={toggleVariant}
            variant="link"
            className="text-neutral-500"
          >
            {content[variant].buttonText}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
