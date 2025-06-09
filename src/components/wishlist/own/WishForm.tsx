import { WishType } from "~/services/wishlist/types";
import { Input } from "~/components/ui/input";
import { Form, FormLabel, FormField, FormControl, FormItem } from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import React, { useEffect, useTransition } from "react";
import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useCreateWish, useUpdateWish } from "~/components/wishlist/own/hooks";
import { Badge } from "~/components/ui/badge";
import { currencies, currencyNames } from "~/lib/i18n/currencies";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { Scrollable } from "~/components/ui/scrollable";
import { skipOnboardingStepAction } from "~/services/onboarding/actions";
import { SkipOnboardingStepFormData } from "~/services/onboarding/formData";
import { showErrorToast } from "~/components/ui/toasts";
import { getErrorMessage } from "~/core/errorMessages";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { DesktopOnly, MobileOnly } from "~/components/MediaComponents";

const formSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("validation.titleRequired")).max(80, t("validation.titleTooLong")),
    price: z.number({ coerce: true }).optional().nullable().default(null),
    currency: z.string().optional().nullable(),
    url: z.string().url().optional().nullable(),
    comment: z.string().max(150, t("validation.commentTooLong")).optional().nullable(),
    isPrivate: z.boolean(),
  });

export type WishFormValues = z.infer<ReturnType<typeof formSchema>>;

type WishFormProps = {
  wish?: WishType;
  onActionSuccess?: () => void;
  showReserved?: boolean;
  onBack?: () => void;
  firstWish?: boolean;
};

export function WishForm({ wish, onActionSuccess, showReserved, onBack, firstWish }: WishFormProps) {
  const [isCreating, createWish] = useCreateWish(firstWish);
  const [isUpdating, updateWish] = useUpdateWish();
  const { t } = useTranslation();

  const { control, formState, reset, ...form } = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(t)),
    resetOptions: { keepValues: false, keepDirty: false, keepErrors: false },
    mode: "onTouched",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <Scrollable
          footer={
            firstWish ? (
              <FirstWishFormButtons wish={wish} disabled={!formState.isValid} isLoading={isUpdating || isCreating} />
            ) : (
              <WishFormButtons wish={wish} isLoading={isUpdating || isCreating} onBack={onBack} />
            )
          }
        >
          <div className="mx-auto max-w-lg px-4">
            {showReserved && wish?.reservedById && (
              <div className="flex justify-center">
                <Badge variant="attention">{t("wishForm.reservedHint")}</Badge>
              </div>
            )}
            <div className="flex flex-1 flex-col gap-5">
              <FormField
                control={control}
                name="name"
                disabled={isReadonly}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wishForm.labels.title")}</FormLabel>
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
                    <FormLabel>{t("wishForm.labels.link")}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    {isUpdatingMode && field.value && !formState.errors.url && (
                      <Link
                        href={field.value}
                        target="_blank"
                        className="absolute -top-2 right-1 flex items-center gap-1 text-sm"
                      >
                        {t("actions.openLink")} <ArrowSquareOut className="size-5" />
                      </Link>
                    )}
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-[3fr_2fr] gap-2">
                <FormField
                  control={control}
                  name="price"
                  disabled={isReadonly}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("wishForm.labels.price")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value ?? ""} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="currency"
                  disabled={isReadonly || !form.getValues().price}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("wishForm.labels.currency")}</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={String(field.value) ?? undefined}
                          options={currencies.map(currency => ({ value: currency, label: currencyNames[currency] }))}
                          placeholder={t("placeholders.selectCurrency")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isReadonly}
                control={control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("wishForm.labels.comment")}</FormLabel>
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
                      <FormLabel>{t("wishForm.labels.privacy")}</FormLabel>
                      <span className="text-xs text-foreground/60">{t("wishForm.labels.makePrivate")}</span>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Scrollable>
      </form>
    </Form>
  );
}

function WishFormButtons({ wish, isLoading, onBack }: { wish?: WishType; isLoading: boolean; onBack?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto grid w-full max-w-lg grid-cols-[1fr_2fr] items-center justify-end gap-4 px-4 lg:mt-8 lg:grid-cols-[min-content_min-content]">
      <Button isLoading={isLoading} variant="outline" onClick={onBack} fullWidth size="lg" minWidth={false}>
        {t("actions.cancel")}
      </Button>
      <MobileOnly>
        <Button type="submit" isLoading={isLoading} fullWidth minWidth={false} size="lg">
          {wish ? t("actions.save") : t("actions.addWish")}
        </Button>
      </MobileOnly>
      <DesktopOnly>
        <Button type="submit" isLoading={isLoading} size="lg">
          {wish ? t("actions.save") : t("actions.addWish")}
        </Button>
      </DesktopOnly>
    </div>
  );
}

function FirstWishFormButtons({
  wish,
  disabled,
  isLoading,
}: {
  wish?: WishType;
  disabled: boolean;
  isLoading: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const skip = () => {
    startTransition(async () => {
      const { error } = await skipOnboardingStepAction(SkipOnboardingStepFormData.fromObject({ type: "first-wish" }));
      if (error) {
        showErrorToast(getErrorMessage(error, t));
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 pb-12">
      <Button size="lg" onClick={skip} variant="ghost">
        {isPending ? t("states.skipping") : t("actions.skip")}
      </Button>
      <Button type="submit" disabled={disabled} isLoading={isLoading} size="lg" fullWidth minWidth={false}>
        {wish ? t("actions.save") : t("actions.addWish")}
      </Button>
    </div>
  );
}
