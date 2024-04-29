export class TypedFormData<T extends Record<string, string | number>> {
  fromObject(obj: T): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    return formData;
  }

  toObject(formData: FormData): T {
    const formDataEntries = Object.entries(Object.fromEntries(formData));
    const obj: Record<string, string | number> = {};

    formDataEntries.forEach(([key, value]) => {
      if (value instanceof File) {
        return;
      }

      const maybeNumber = parseFloat(value);

      if (!isNaN(maybeNumber)) {
        obj[key] = maybeNumber;
        return;
      }

      obj[key] = value;
    });

    return obj as T;
  }
}

export const SignUpFormData = new TypedFormData<{ username: string }>();
export const WishlistReservationFormData = new TypedFormData<{ wishId: string }>();
