import CreatePostNav from "@/components/createPost/createPostNav";
import type React from "react";

export default function CreatePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <div className="w-full">
        <CreatePostNav />
      </div>
      <main className="flex items-center justify-center mx-auto my-auto max-w-4xl min-h-screen">
        {children}
      </main>
    </div>
  );
}
