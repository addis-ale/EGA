"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { formSchema, FormValues } from "@/types/types";
import { BasicInformation } from "@/components/createPost/basicInformation";
import { AgeRating } from "@/components/createPost/ageRating";
import { MediaUpload } from "@/components/createPost/mediaUpload";

export default function CreateGameForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      discountPrice: "",
      price: "",
      ageLimit: "ALL",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="border-none shadow-none bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create New Game
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <BasicInformation control={form.control} />
                  <AgeRating control={form.control} />
                </div>

                {/* Right Column */}
                <MediaUpload control={form.control} />
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6 transition-all hover:scale-[1.02]"
              >
                Create Game
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
