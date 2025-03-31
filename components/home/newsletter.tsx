"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 表单校验 schema (Form validation schema)
const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});

type SubscribeFormValues = z.infer<typeof subscribeSchema>;

// 提交状态类型 (Submit status type)
type SubmitStatus = "idle" | "loading" | "success" | "error";

const NewsLetter = () => {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SubscribeFormValues) => {
    try {
      setStatus("loading");
      setErrorMessage("");

      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div>
      <section className="bg-muted/30 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold">Subscribe for free</h2>
          <p className="mb-6 text-muted-foreground">
            Get the latest articles delivered directly to your inbox.
          </p>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        disabled={status === "loading"}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </Form>

          {/* 状态提示 (Status message) */}
          {status === "success" && (
            <p className="mt-4 text-sm text-green-600">
              Successfully subscribed! Thank you for subscribing.
            </p>
          )}
          {status === "error" && (
            <p className="mt-4 text-sm text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsLetter;
