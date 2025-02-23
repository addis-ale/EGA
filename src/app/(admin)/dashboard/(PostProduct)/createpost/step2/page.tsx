/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
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
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/state/features/createPostSlice";
import type { RootState } from "@/state/store";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const formSchema = z.object({
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported."
    ),
  video: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE * 10, `Max file size is 50MB.`)
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Only .mp4, .webm, and .ogg formats are supported."
    ),
});

function Dropzone({
  onDrop,
  accept,
  maxSize,
  children,
}: {
  onDrop: (acceptedFiles: File[]) => void;
  accept: string[];
  maxSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (props: any) => React.ReactNode;
}) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
  });

  return children({ getRootProps, getInputProps });
}

export default function StepTwo() {
  const product = useSelector((state: RootState) => state.createPost);
  const { video, coverImage } = product;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coverImage: coverImage,
      video: video,
    },
  });
  const { toast } = useToast();
  const dispatch = useDispatch();

  const [uploadedCoverImage, setUploadedCoverImage] = useState<string | null>(
    null
  );
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  useEffect(() => {
    // If cover image exists in Redux, set the object URL or use it directly if it's a URL
    if (coverImage instanceof File) {
      setUploadedCoverImage(URL.createObjectURL(coverImage));
    } else if (coverImage) {
      setUploadedCoverImage(coverImage); // If it's already a URL
    }

    // If video exists in Redux, set the object URL or use it directly if it's a URL
    if (video instanceof File) {
      setUploadedVideo(URL.createObjectURL(video));
    } else if (video) {
      setUploadedVideo(video); // If it's already a URL
    }

    return () => {
      // Clean up the object URLs to avoid memory leaks
      if (uploadedCoverImage) URL.revokeObjectURL(uploadedCoverImage);
      if (uploadedVideo) URL.revokeObjectURL(uploadedVideo);
    };
  }, [coverImage, video, uploadedCoverImage, uploadedVideo]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if both files are uploaded, if not show a toast

    //dispatch the file

    if (!values.coverImage) {
      toast({
        title: "Error",
        description: "Please upload a cover image.",
        variant: "destructive",
      });
      return;
    }
    if (!values.video) {
      toast({
        title: "Error",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }
    dispatch(updateProduct({ ...product, ...values }));
    toast({
      title: "You submitted the following files:",
      description: (
        <div>
          <strong>Cover Image:</strong> {uploadedCoverImage || "None"} <br />
          <strong>Video:</strong> {uploadedVideo || "None"}
        </div>
      ),
    });
    router.push("/dashboard/createpost/step3");
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], fieldName: "coverImage" | "video") => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        form.setValue(fieldName, file, { shouldValidate: true });

        if (fieldName === "coverImage") {
          setUploadedCoverImage((prev) => {
            if (prev) URL.revokeObjectURL(prev); // Clean up previous object URL
            return URL.createObjectURL(file);
          });
        } else if (fieldName === "video") {
          setUploadedVideo((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
          });
        }
      }
    },
    [form]
  );
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-6xl bg-white shadow-lg rounded-lg">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Media Upload
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div
                className={`grid gap-6 ${
                  !uploadedCoverImage && !uploadedVideo
                    ? "md:grid-cols-2"
                    : "md:flex md:flex-row"
                }`}
              >
                {/* Dropzones */}
                <div
                  className={`space-y-6 md:space-y-0 ${
                    !uploadedCoverImage && !uploadedVideo
                      ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-6"
                      : "flex-1"
                  }`}
                >
                  {/* Cover Image Dropzone */}
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700">
                          Cover Image
                        </FormLabel>
                        <FormControl>
                          <Dropzone
                            onDrop={(files) => onDrop(files, "coverImage")}
                            accept={ACCEPTED_IMAGE_TYPES}
                            maxSize={MAX_FILE_SIZE}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                {...getRootProps()}
                                className="w-full h-[200px] p-4 border-2 border-dashed border-gray-400 rounded-md text-center cursor-pointer hover:bg-gray-100 flex flex-col justify-center"
                              >
                                <input {...getInputProps()} />
                                <p className="text-gray-600">
                                  Click to upload or drag & drop
                                </p>
                                <p className="text-sm text-gray-500">
                                  PNG, JPG, WEBP (MAX. 5MB)
                                </p>
                              </div>
                            )}
                          </Dropzone>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Video Dropzone */}
                  <FormField
                    control={form.control}
                    name="video"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-gray-700">
                          Video
                        </FormLabel>
                        <FormControl>
                          <Dropzone
                            onDrop={(files) => onDrop(files, "video")}
                            accept={ACCEPTED_VIDEO_TYPES}
                            maxSize={MAX_FILE_SIZE * 10}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div
                                {...getRootProps()}
                                className="w-full h-[200px] p-4 border-2 border-dashed border-gray-400 rounded-md text-center cursor-pointer hover:bg-gray-100 flex flex-col justify-center"
                              >
                                <input {...getInputProps()} />
                                <p className="text-gray-600">
                                  Click to upload or drag & drop
                                </p>
                                <p className="text-sm text-gray-500">
                                  MP4, WEBM, OGG (MAX. 50MB)
                                </p>
                              </div>
                            )}
                          </Dropzone>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Previews (only rendered if there's content) */}
                {(uploadedCoverImage || uploadedVideo) && (
                  <div className="space-y-6 flex-1">
                    {uploadedCoverImage && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-700 ">
                          Cover Image Preview
                        </h2>
                        <div className="w-full h-[200px] relative rounded-md overflow-hidden">
                          <Image
                            src={uploadedCoverImage || "/placeholder.svg"}
                            alt="Cover Image Preview"
                            fill
                            className="object-cover "
                          />
                        </div>
                      </div>
                    )}

                    {uploadedVideo && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-700 ">
                          Video Preview
                        </h2>
                        <div className="w-full h-[200px] relative rounded-md overflow-hidden">
                          <video
                            src={uploadedVideo || "/placeholder.mp3"}
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
              </div>

              <div className="flex gap-4 w-full mt-6">
                <Button
                  type="button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-3 rounded-md border"
                  onClick={() => router.push("/dashboard/createpost/step1")}
                >
                  Preview
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md"
                  onClick={() => form.handleSubmit(onSubmit)()}
                >
                  Save & Continue
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
