import { z } from "zod";

export enum GameType {
  ACTION = "Action",
  ADVENTURE = "Adventure",
  RPG = "RPG",
  STRATEGY = "Strategy",
  SIMULATION = "Simulation",
  PUZZLE = "Puzzle",
  SPORTS = "Sports",
  RACING = "Racing",
  FIGHTING = "Fighting",
  HORROR = "Horror",
}

export const AGE_LIMITS = [
  { value: "13", label: "Teen", description: "Suitable for ages 13 and up" },
  { value: "15", label: "Teen+", description: "Suitable for ages 15 and up" },
  { value: "18", label: "Mature", description: "Suitable for ages 18 and up" },
  { value: "ALL", label: "Everyone", description: "Suitable for all ages" },
] as const;

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(500, "Description cannot exceed 500 characters"),
  gameType: z.nativeEnum(GameType),
  image: z.instanceof(File).optional(),
  video: z.instanceof(File).optional(),
  discountPrice: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid number",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Must be a valid number",
  }),
  ageLimit: z.enum(["13", "15", "18", "ALL"]),
});

export type FormValues = z.infer<typeof formSchema>;
