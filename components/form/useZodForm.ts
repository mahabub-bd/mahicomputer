"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";


export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType,
  props?: Omit<UseFormProps<TFieldValues>, "resolver">
): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...props,
    resolver: zodResolver(schema as never) as unknown as Resolver<TFieldValues>,
  });
}
