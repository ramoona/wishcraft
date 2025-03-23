import { WishType } from "~/services/wishlist/types";
import { Input } from "~/components/ui/input";
import { Form, FormLabel, FormField, FormControl, FormItem } from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useCreateWish, useUpdateWish } from "~/components/wishlist/own/hooks";
import { Badge } from "~/components/ui/badge";
import { currencies, currencyNames } from "~/lib/currencies";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Title is required").max(255, "Oof, that's too long"),
  price: z.number({ coerce: true }).optional().nullable().default(null),
  currency: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  comment: z.string().max(255, "Oof, that's too long").optional().nullable(),
  isPrivate: z.boolean(),
});

export type WishFormValues = z.infer<typeof formSchema>;

type WishFormProps = {
  wish?: WishType;
  onActionSuccess?: () => void;
  showReserved?: boolean;
  onBack?: () => void;
};

export function WishForm({ wish, onActionSuccess, showReserved, onBack }: WishFormProps) {
  const [isCreating, createWish] = useCreateWish();
  const [isUpdating, updateWish] = useUpdateWish();

  const { control, formState, reset, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    resetOptions: { keepValues: false, keepDirty: false, keepErrors: false },
    mode: "onBlur",
    defaultValues: {
      name: wish?.name ?? "",
      price: wish?.price ?? null,
      currency: wish?.currency ?? "EUR",
      url: wish?.url ?? null,
      comment: wish?.comment ?? null,
      isPrivate: wish?.isPrivate ?? false,
    },
  });
  const isUpdatingMode = !!wish;
  const isReadonly = !!wish?.status && ["FULFILLED", "ARCHIVED"].includes(wish.status);
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        comment: "",
        currency: null,
        name: "",
        price: null,
        url: "",
        isPrivate: false,
      });
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = (values: WishFormValues) => {
    if (wish) {
      updateWish(wish.id, values, onActionSuccess);
    } else {
      createWish(values, onActionSuccess);
    }
  };

  return (
    <Form control={control} reset={reset} formState={formState} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-full flex-col gap-8">
        <div className="bg-white text-center">{wish ? "Edit" : "Create"} Wish</div>
        {showReserved && wish?.reservedById && (
          <div className="flex justify-center">
            <Badge variant="attention">This wish is reserved by someone</Badge>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-4">
          <FormField
            control={control}
            name="name"
            disabled={isReadonly}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="url"
            disabled={isReadonly}
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                {isUpdatingMode && field.value && !formState.errors.url && (
                  <Link
                    href={field.value}
                    target="_blank"
                    className="absolute bottom-0 right-1 flex translate-y-full items-center gap-1"
                  >
                    Open link <ArrowSquareOut className="size-5" />
                  </Link>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            disabled={isReadonly}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <div className="grid grid-cols-[3fr_2fr] gap-2">
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormControl>
                    <Select
                      value={form.getValues().currency || ""}
                      onChange={v => form.setValue("currency", v)}
                      options={currencies.map(currency => ({ value: currency, label: currencyNames[currency] }))}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            disabled={isReadonly}
            control={control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={isReadonly}
            control={control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2">
                <div>
                  <FormLabel>Make Private</FormLabel>
                  <span className="text-xs text-foreground/60">Toggle if the wish should be visible to you only</span>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <WishFormButtons
          wish={wish}
          disabled={!formState.isValid}
          isLoading={isUpdating || isCreating}
          onBack={onBack}
        />
      </form>
    </Form>
  );
}

function WishFormButtons({
  wish,
  disabled,
  isLoading,
  onBack,
}: {
  wish?: WishType;
  disabled: boolean;
  isLoading: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="mt-auto grid w-full grid-cols-2 gap-4">
      <Button size="lg" isLoading={isLoading} variant="tertiary" onClick={onBack} minWidth={false} fullWidth>
        Back
      </Button>
      <Button type="submit" disabled={disabled} size="lg" isLoading={isLoading} minWidth={false} fullWidth>
        {wish ? "Save" : "Make a wish"}
      </Button>
    </div>
  );
}
