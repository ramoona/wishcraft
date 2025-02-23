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
import { ArrowSquareOut, Gift, ShootingStar } from "@phosphor-icons/react";
import { WishDropdownMenu } from "~/components/wishlist/own/WishDropdownMenu";
import { useCreateWish, useUpdateWish } from "~/components/wishlist/own/hooks";
import { Badge } from "~/components/ui/badge";
import { currencies, currencyNames } from "~/lib/currencies";
import { Switch } from "~/components/ui/switch";

const formSchema = z.object({
  name: z.string().max(255, "Oof, that's too long"),
  price: z.number({ coerce: true }).optional().nullable().default(null),
  currency: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  comment: z.string().max(255, "Oof, that's too long").optional().nullable(),
  isPrivate: z.boolean(),
});

export type WishFormValues = z.infer<typeof formSchema>;

type WishFormProps = {
  wish?: WishType;
  onCancel: () => void;
  onActionSuccess?: () => void;
  showReserved?: boolean;
};

export function WishForm({ wish, onActionSuccess, showReserved }: WishFormProps) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-8">
        {showReserved && wish?.reservedById && (
          <div className="mt-4 flex justify-center">
            <Badge variant="attention">
              <Gift className="mr-2 size-5" />
              This wish is reserved by someone
            </Badge>
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
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            disabled={isReadonly}
            control={control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid w-full grid-cols-[auto_max-content] gap-4">
          <WishFormButtonsMobile
            wish={wish}
            disabled={!formState.isValid}
            isLoading={isUpdating || isCreating}
            onActionSuccess={onActionSuccess}
          />
        </div>
      </form>
    </Form>
  );
}

function WishFormButtonsMobile({
  wish,
  disabled,
  isLoading,
  onActionSuccess,
}: {
  wish?: WishType;
  disabled: boolean;
  isLoading: boolean;
  onActionSuccess?: () => void;
}) {
  const [isUpdating, updateWish] = useUpdateWish();
  if (!wish) {
    return (
      <Button type="submit" disabled={disabled} size="lg">
        <div className="flex items-center justify-center gap-2">
          <ShootingStar size={24} />
          Make a wish
        </div>
      </Button>
    );
  }

  if (wish.status === "ARCHIVED" || wish.status === "FULFILLED") {
    return (
      <>
        <Button
          type="button"
          onClick={() => updateWish(wish.id, { status: "ACTIVE" })}
          size="lg"
          isLoading={isUpdating}
        >
          Move to Active
        </Button>
        <WishDropdownMenu onActionSuccess={onActionSuccess} wish={wish} isMobile />
      </>
    );
  }

  return (
    <>
      <Button type="submit" disabled={disabled} size="lg" isLoading={isLoading}>
        Save
      </Button>
      <WishDropdownMenu onActionSuccess={onActionSuccess} wish={wish} isMobile />
    </>
  );
}
