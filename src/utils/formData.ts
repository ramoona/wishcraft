export class TypedFormData<T extends Record<string, string | number | boolean | null | undefined>> {
  fromObject(obj: T): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, value ? "__BOOLEAN_TRUE__" : "__BOOLEAN_FALSE__");
        return;
      }
      formData.append(key, value.toString());
    });

    return formData;
  }

  toObject(formData: FormData): T {
    const obj: Record<string, string | number | boolean> = {};

    for (const key of formData.keys()) {
      const value = formData.get(key);
      if (typeof value !== "string") {
        continue;
      }

      const maybeNumber = parseFloat(value);

      if (!isNaN(maybeNumber) && value.length === maybeNumber.toString().length) {
        obj[key] = maybeNumber;
        continue;
      }

      if (value === "__BOOLEAN_TRUE__") {
        obj[key] = true;
        continue;
      }

      if (value === "__BOOLEAN_FALSE__") {
        obj[key] = false;
        continue;
      }

      obj[key] = value;
    }

    return obj as T;
  }
}
