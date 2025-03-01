"use client";

import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardTitle } from "@/components/ui/card";
import { FormValues } from "@/types/types";
import { FileUpload } from "./fileUpload";

interface MediaUploadProps {
  control: Control<FormValues>;
}

export function MediaUpload({ control }: MediaUploadProps) {
  return (
    <Card className="p-6 space-y-6  bg-white text-black border-none">
      <CardTitle className="text-xl">Media</CardTitle>
      <FormField
        control={control}
        name="image"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>Game Image</FormLabel>
            <FormControl>
              <FileUpload
                onChange={onChange}
                value={value}
                accept="image/*"
                label="image"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="video"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>Game Video</FormLabel>
            <FormControl>
              <FileUpload
                onChange={onChange}
                value={value}
                accept="video/*"
                label="video"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
