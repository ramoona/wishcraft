import { WishT } from "~/types/wishlist";
import { Input } from "~/components/ui/input";
import { Form, FormLabel, FormField, FormControl, FormDescription, FormItem } from "~/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().max(255, "Oof, that's too long"),
  price: z
    .string()
    .nullable()
    .transform(v => (v ? parseFloat(v) : null))
    .default(null),
  currency: z.nativeEnum(Currency),
  url: z
    .string()
    .url()
    .nullable()
    .transform(v => (v ? v : null)),
  comment: z.string().max(255, "Oof, that's too long").nullable(),
});

export type WishFormValues = z.infer<typeof formSchema>;

type WishFormProps = {
  data?: Omit<WishT, "status" | "reservedById">;
  onSubmit: (values: WishFormValues) => void;
  onCancel: () => void;
};

export function WishForm({ data, onCancel, onSubmit }: WishFormProps) {
  const { control, formState, reset, ...form } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    resetOptions: { keepValues: false, keepDirty: false, keepErrors: false },
    mode: "onBlur",
    defaultValues: {
      name: data?.name ?? "",
      price: data?.price ?? null,
      currency: data?.currency ?? Currency.EUR,
      url: data?.url ?? null,
      comment: data?.comment ?? null,
    },
  });
  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        comment: "",
        currency: Currency.EUR,
        name: "",
        price: null,
        url: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Form control={control} reset={reset} formState={formState} {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>What is it?</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>Where to find it?</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <div className="grid grid-cols-[3fr_2fr] gap-2">
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormControl>
                    <Select
                      value={form.getValues().currency}
                      onChange={v => form.setValue("currency", v as Currency)}
                      options={[
                        { value: Currency.EUR, label: "Euro" },
                        { value: Currency.USD, label: "US Dollar" },
                      ]}
                    />
                  </FormControl>
                </div>
                <FormDescription>How much is it?</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormDescription>Anything else to know about it?</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <Button variant="outline" onClick={onCancel}>
            Nevermind
          </Button>
          <Button type="submit">Looks good</Button>
        </div>
      </form>
    </Form>
  );
}
