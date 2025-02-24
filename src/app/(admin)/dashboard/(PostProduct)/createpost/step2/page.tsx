/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { ImageIcon, Video, ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/state/features/createPostSlice";
import type { RootState } from "@/state/store";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  uploadedCoverImage: z.string().min(1, "Cover image is required."),
  uploadedVideo: z.string().min(1, "Video is required."),
});

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function MediaUpload() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const product = useSelector((state: RootState) => state.createPost);
  const {
    productName,
    productDescription,
    uploadedCoverImage: coverImage,
    uploadedVideo: video,
  } = product;
  const [uploadedCoverImage, setUploadedCoverImage] = useState<string | null>(
    coverImage || null
  );
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(
    video || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [widgetInstance, setWidgetInstance] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadedCoverImage: coverImage || "",
      uploadedVideo: video || "",
    },
  });

  useEffect(() => {
    if (!productName || !productDescription) {
      router.push("/dashboard/createpost/step1");
    }
    if (uploadedCoverImage || uploadedVideo) {
      setUploadedCoverImage(uploadedCoverImage);
      setUploadedVideo(uploadedVideo);
    }
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [
    productDescription,
    productName,
    router,
    uploadedVideo,
    uploadedCoverImage,
  ]);

  const openCloudinaryWidget = (mediaType: "image" | "video") => {
    if (typeof window.cloudinary === "undefined") {
      console.error("Cloudinary widget is not loaded");
      return;
    }

    const uploadPreset = "EGA Store";
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      console.error("Cloudinary cloud name is not set");
      return;
    }

    const options = {
      cloudName,
      uploadPreset,
      sources: [
        "local",
        "url",
        "camera",
        "dropbox",
        "google_drive",
        "facebook",
        "instagram",
        "shutterstock",
        "getty",
        "istock",
        "unsplash",
      ],
      multiple: false,
      resourceType: mediaType,
      maxFiles: 1,
    };

    const widget = window.cloudinary.createUploadWidget(
      options,
      async (error: any, result: any) => {
        if (!error && result) {
          if (result.event === "success") {
            const secureUrl = result.info.secure_url;

            if (mediaType === "image") {
              setImageLoading(true);
              // Preload image
              const img = new window.Image();
              img.onload = () => {
                setUploadedCoverImage(secureUrl);
                form.setValue("uploadedCoverImage", secureUrl);
                dispatch(updateProduct({ uploadedCoverImage: secureUrl }));
                setImageLoading(false);
                widget.close();
                toast({
                  title: "Image uploaded",
                  description: "Your image has been uploaded successfully.",
                });
              };
              img.src = secureUrl;
            } else {
              setVideoLoading(true);
              // Check if video is ready
              const video = document.createElement("video");
              video.onloadeddata = () => {
                setUploadedVideo(secureUrl);
                form.setValue("uploadedVideo", secureUrl);
                dispatch(updateProduct({ uploadedVideo: secureUrl }));
                setVideoLoading(false);
                widget.close();
                toast({
                  title: "Video uploaded",
                  description: "Your video has been uploaded successfully.",
                });
              };
              video.src = secureUrl;
            }
          } else if (result.event === "close") {
            setWidgetInstance(null);
          }
        }
      }
    );

    setWidgetInstance(widget);
    widget.open();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        widgetInstance &&
        !(event.target as HTMLElement).closest(".cloudinary-widget") &&
        !(event.target as HTMLElement).closest(".upload-trigger")
      ) {
        widgetInstance.close();
        setWidgetInstance(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [widgetInstance]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    dispatch(
      updateProduct({
        uploadedCoverImage: uploadedCoverImage || "",
        uploadedVideo: uploadedVideo || "",
      })
    );

    toast({
      title: "Files uploaded successfully",
      description: "Your media files have been saved.",
    });

    router.push("/dashboard/createpost/step3");
  }
  if (productDescription && productName)
    return (
      <div className="min-h-screen  p-4 flex items-center justify-center">
        <Card className="w-full max-w-6xl bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Media Upload</h1>
              <p className="text-muted-foreground mt-2">
                Upload your cover image and video
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Upload */}
                  <FormField
                    control={form.control}
                    name="uploadedCoverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Cover Image
                        </FormLabel>
                        <FormControl>
                          <div
                            className={`
                            aspect-video rounded-xl border-2 border-dashed
                            ${
                              uploadedCoverImage
                                ? "border-0"
                                : "border-gray-300 hover:border-gray-400"
                            }
                            transition-all duration-300
                            flex flex-col items-center justify-center overflow-hidden relative
                            cursor-pointer upload-trigger
                          `}
                            onClick={() => openCloudinaryWidget("image")}
                          >
                            {uploadedCoverImage ? (
                              <>
                                <Image
                                  src={uploadedCoverImage || "/placeholder.svg"}
                                  alt="Preview"
                                  width={500}
                                  height={300}
                                  className={`object-cover transition-opacity duration-300 ${
                                    imageLoading ? "opacity-50" : "opacity-100"
                                  }`}
                                />
                                {imageLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center p-8">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">
                                  Click to upload image
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  All image formats supported
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Video Upload */}
                  <FormField
                    control={form.control}
                    name="uploadedVideo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Video
                        </FormLabel>
                        <FormControl>
                          <div
                            className={`
                            aspect-video rounded-xl border-2 border-dashed
                            ${
                              uploadedVideo
                                ? "border-0"
                                : "border-gray-300 hover:border-gray-400"
                            }
                            transition-all duration-300
                            flex flex-col items-center justify-center overflow-hidden relative
                            cursor-pointer upload-trigger
                          `}
                            onClick={() => openCloudinaryWidget("video")}
                          >
                            {uploadedVideo ? (
                              <>
                                <video
                                  src={uploadedVideo}
                                  controls
                                  className={`xl:w-[500px] xl:h-[300px] w-full h-full object-cover transition-opacity duration-300 ${
                                    videoLoading ? "opacity-50" : "opacity-100"
                                  }`}
                                >
                                  Your browser does not support the video tag.
                                </video>
                                {videoLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center p-8">
                                <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-600">
                                  Click to upload video
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  All video formats supported
                                </p>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}

                <div className="w-full gap-4 pt-4">
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      className="w-fit bg-gray-200 hover:bg-gray-300 text-black font-semibold rounded-md border py-1 sm:py-2 md:py-6"
                      onClick={() => router.push("/dashboard/createpost/step1")}
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="w-fit py-1 sm:py-2 md:py-6  text-base sm:text-lg bg-teal hover:bg-teal/90 text-white transition-colors duration-200"
                    >
                      Submit & Continue
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
}
