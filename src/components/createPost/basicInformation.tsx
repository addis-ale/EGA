"use client";

import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardTitle } from "@/components/ui/card";
import { FormValues, GameType } from "@/types/types";

interface BasicInformationProps {
  control: Control<FormValues>;
}

export function BasicInformation({ control }: BasicInformationProps) {
  return (
    <Card className="p-6 space-y-6 bg-white text-black border-none">
      <CardTitle className="text-xl">Basic Information</CardTitle>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Game Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter game title"
                {...field}
                className="transition-all focus:ring-2 focus:ring-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Game Description</FormLabel>
            <FormControl>
              <div className="relative">
                <Textarea
                  placeholder="Describe your game... (min. 50 characters)"
                  className="min-h-[160px] resize-y transition-all focus:ring-2 focus:ring-primary pr-12"
                  {...field}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {field.value.length}/500
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Provide a compelling description of your game (50-500 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gameType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Game Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a game type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(GameType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter price"
                  type="number"
                  {...field}
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="discountPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter discount"
                  type="number"
                  {...field}
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
}
