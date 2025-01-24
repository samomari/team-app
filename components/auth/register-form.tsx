"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z
    .object({
        email: z.string().email({
            message: "Please enter a valid email address",
        }),
        name: z.string().min(1, {
            message: "Please enter your name",
        }),
        password: z.string().min(1, {
            message: "Please enter a password",
        }),
        confirmPassword: z.string().min(1, {
            message: "Please confirm your password",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export default function RegisterForm () {
    const [loading, setLoading] = useState(false);
    const [error, setError] =  useState<string | null>(null);
    const router = useRouter();
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        setError(null);

        try {
            await axios.post("/api/register", {
                name: data.name,
                email: data.email,
                password: data.password,
            });

            const loginResponse = await axios.post("/api/login", {
                email: data.email,
                password: data.password,
            })

            localStorage.setItem("token", loginResponse.data.token);
                
            router.push("/dashboard");
        } catch (error: any) {
            setLoading(false);
            if (error.response?.status === 409) {
                form.setError("email", {
                    type: "manual",
                    message: error.response.data.message || "Email is already in use.",
                });
            } else {
                form.setError("root", {
                    type: "manual",
                    message: "Something went wrong. Please try again later.",
                });
            }
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {form.formState.errors.root && (
                    <div className="text-red-500 text-sm flex justify-center">
                        {form.formState.errors.root.message}
                    </div>
                )}
                <div className="space-y-4">
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="johnny@cage.com"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Johnny Cage"/>
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
                                    <Input {...field} type="password" placeholder="******"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder="******"/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Register"}
                </Button>
            </form>
        </Form>
    );
}