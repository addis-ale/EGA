/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/state/features/createPostSlice";
import type { RootState } from "@/state/store";

const formSchema = z.object({
  uploadedCoverImage: z.string().min(1, "Cover image is required."),
  uploadedVideo: z.string().min(1, "Video is required."),
});

interface UploadResult {
  secure_url: string;
}

export default function StepTwo() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // Get existing media from Redux state
  const existingMedia = useSelector((state: RootState) => ({
    coverImage: state.createPost.uploadedCoverImage,
    video: state.createPost.uploadedVideo,
  }));

  const [uploadedCoverImage, setUploadedCoverImage] = useState<string | null>(
    existingMedia.coverImage || null
  );
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(
    existingMedia.video || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadedCoverImage: existingMedia.coverImage || "",
      uploadedVideo: existingMedia.video || "",
    },
  });

  async function uploadFile(file: File, type: "image" | "video") {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "EGA Store");
      formData.append("resource_type", type);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result: UploadResult = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "image");
    if (url) {
      setUploadedCoverImage(url);
      form.setValue("uploadedCoverImage", url);
      dispatch(updateProduct({ uploadedCoverImage: url }));
    }
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "video");
    if (url) {
      setUploadedVideo(url);
      form.setValue("uploadedVideo", url);
      dispatch(updateProduct({ uploadedVideo: url }));
    }
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Files uploaded successfully",
      description: (
        <div>
          <strong>Cover Image:</strong> {uploadedCoverImage || "None"} <br />
          <strong>Video:</strong> {uploadedVideo || "None"}
        </div>
      ),
    });

    router.push("/dashboard/createpost/step3");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-6xl bg-white shadow-lg rounded-lg">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Media Upload
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="uploadedCoverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">
                        Cover Image
                      </FormLabel>
                      <FormControl>
                        <div className="w-full h-[200px] relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isUploading}
                          />
                          <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center">
                            <p className="text-gray-600">
                              {isUploading
                                ? "Uploading..."
                                : "Click to upload cover image"}
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG, WEBP
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uploadedVideo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-gray-700">
                        Video
                      </FormLabel>
                      <FormControl>
                        <div className="w-full h-[200px] relative">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isUploading}
                          />
                          <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center">
                            <p className="text-gray-600">
                              {isUploading
                                ? "Uploading..."
                                : "Click to upload video"}
                            </p>
                            <p className="text-sm text-gray-500">
                              MP4, WEBM, OGG
                            </p>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {(uploadedCoverImage || uploadedVideo) && (
                <div className="space-y-6">
                  {uploadedCoverImage && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        Cover Image Preview
                      </h2>
                      <div className="w-full h-[200px] relative rounded-md overflow-hidden">
                        <Image
                          src={uploadedCoverImage || "/placeholder.svg"}
                          alt="Cover Image Preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  )}

                  {uploadedVideo && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-700">
                        Video Preview
                      </h2>
                      <div className="w-full h-[200px] relative rounded-md overflow-hidden">
                        <video
                          src={uploadedVideo}
                          controls
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 w-full mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/dashboard/createpost/step1")}
                >
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Save & Continue"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
