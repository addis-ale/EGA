"use client";

import type { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardTitle } from "@/components/ui/card";
import { AGE_LIMITS, FormValues } from "@/types/types";
import { OptionCard } from "./optionCard";

interface AgeRatingProps {
  control: Control<FormValues>;
}

export function AgeRating({ control }: AgeRatingProps) {
  return (
    <Card className="p-6 space-y-6  bg-white text-black border-none">
      <CardTitle className="text-xl">Age Rating</CardTitle>
      <FormField
        control={control}
        name="ageLimit"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                {AGE_LIMITS.map((age) => (
                  <OptionCard
                    key={age.value}
                    selected={field.value === age.value}
                    onClick={() => field.onChange(age.value)}
                    label={age.label}
                    description={age.description}
                  />
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
}
