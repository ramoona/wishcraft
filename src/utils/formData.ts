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
    const obj: Record<string, string | number> = {};

    for (const key of formData.keys()) {
      const value = formData.get(key);
      if (typeof value !== "string") {
        continue;
      }

      const maybeNumber = parseFloat(value);

      if (!isNaN(maybeNumber)) {
        obj[key] = maybeNumber;
        continue;
      }

      obj[key] = value;
    }

    return obj as T;
  }
}
