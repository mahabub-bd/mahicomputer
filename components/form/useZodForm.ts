"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { FieldValues, Resolver, UseFormProps, UseFormReturn } from "react-hook-form";
import type { z } from "zod";

/**
 * `useForm` wired to a Zod schema as its resolver.
 *
 * Zod's coercing fields (`z.coerce.number()`, `.default()`, …) make a schema's
 * *input* type differ from its *output* type, which React Hook Form's generic
 * signature cannot express cleanly. Forms are typed with the schema's output
 * (the values `onSubmit` receives) and the resolver is bridged once, here,
 * instead of at every call site.
 */
export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType,
  props?: Omit<UseFormProps<TFieldValues>, "resolver">
): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...props,
    resolver: zodResolver(schema as never) as unknown as Resolver<TFieldValues>,
  });
}
