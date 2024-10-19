import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { uniqueNamesGenerator, animals, adjectives } from "unique-names-generator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    length: 2,
  });
}
export function formDataToObject<T extends Record<string, string | number | null | undefined>>(formData: FormData) {
  const formDataEntries = Object.entries(Object.fromEntries(formData));
  // eslint-disable-next-line no-console
  console.info("Create object entries from form data");

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

    console.info("Value", key, value);

    obj[key] = value;
  });

  console.info("Transformed values", JSON.stringify(obj));

  return obj as T;
}

export class TypedFormData<T extends Record<string, string | number | null | undefined>> {
  fromObject(obj: T): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
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
