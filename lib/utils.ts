import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// The `cn` function takes any number of class values as arguments.
export function cn(...inputs: ClassValue[]) {
  // `clsx(inputs)` will process the class names, handling conditions, and merging them.
  // `twMerge(...)` will handle any conflicts between Tailwind classes and optimize them.
  return twMerge(clsx(inputs))
}