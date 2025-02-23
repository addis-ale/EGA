"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onChange: (file: File) => void;
  value?: File;
  accept: string;
  label: string;
}

export function FileUpload({
  onChange,
  value,
  accept,
  label,
}: FileUploadProps) {
  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-all",
        "relative min-h-[160px] flex flex-col items-center justify-center",
        "bg-muted/30 hover:bg-muted/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) onChange(file);
      }}
    >
      <Input
        type="file"
        accept={accept}
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
        }}
      />
      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Drag and drop your {label} here or click to browse
      </p>
      {value && (
        <p className="mt-2 text-sm text-primary font-medium">
          Selected: {value.name}
        </p>
      )}
    </div>
  );
}
