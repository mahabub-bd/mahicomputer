"use client";

import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import type { UserView } from "@/lib/types";
import {
  userCreateSchema,
  userUpdateSchema,
  type UserFormInput,
} from "@/lib/validators";
import { apiPost, apiPut } from "./api";
import ImageUpload from "./ImageUpload";
import { Field, Input, SubmitButton } from "@/components/form/FormControls";
import { useZodForm } from "@/components/form/useZodForm";

interface UserFormProps {
  user?: UserView;
  onSuccess?: () => void;
}

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useZodForm<UserFormInput>(user ? userUpdateSchema : userCreateSchema, {
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      imageUrl: user?.imageUrl ?? "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (user) {
        await apiPut(`/api/admin/users/${user.id}`, data);
        toast.success("Admin account updated");
      } else {
        await apiPost("/api/admin/users", data);
        toast.success("Admin account created");
      }
      onSuccess?.();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Name" required error={errors.name?.message}>
        <Input
          {...register("name")}
          aria-invalid={!!errors.name}
          placeholder="e.g. Mahabub Hossain"
        />
      </Field>
      <Field label="Email" required error={errors.email?.message}>
        <Input
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
          placeholder="name@example.com"
        />
      </Field>
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => (
          <ImageUpload
            label="Profile photo"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Field
        label={user ? "Password (leave blank to keep current)" : "Password"}
        required={!user}
        error={errors.password?.message}
      >
        <Input
          type="password"
          {...register("password")}
          aria-invalid={!!errors.password}
          placeholder={user ? "••••••••" : "Min 8 characters"}
          autoComplete="new-password"
        />
      </Field>
      {errors.imageUrl?.message && (
        <p className="text-sm text-rose-600">{errors.imageUrl.message}</p>
      )}
      <SubmitButton busy={isSubmitting}>
        {user ? "Update account" : "Create account"}
      </SubmitButton>
    </form>
  );
};

export default UserForm;
