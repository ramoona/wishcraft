import { isNil } from "ramda";
import { ZodSchema } from "zod";

export class TypedFormData<T extends Record<string, string | number | boolean | null | undefined>> {
  private schema: ZodSchema<T>;

  constructor(schema: ZodSchema<T>) {
    this.schema = schema;
  }

  fromObject(obj: T): FormData {
    return this.serialize(obj);
  }

  toObject(formData: FormData): T {
    const result = this.parse(formData);

    try {
      return this.schema.parse(result);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Invalid FormData value: ", JSON.stringify(result), error);
      throw new Error("INVALID_VALUE");
    }
  }

  private serialize(obj: T): FormData {
    const formData = new FormData();

    Object.entries(obj).forEach(([key, value]) => {
      if (isNil(value)) {
        return;
      }

      let valueType;

      if (typeof value === "string") {
        valueType = "string";
      } else if (typeof value === "number") {
        valueType = "number";
      } else {
        valueType = "boolean";
      }

      formData.append(key, value.toString());
      formData.append(`${key}-type`, valueType);
    });

    return formData;
  }

  private parse(formData: FormData): T {
    const obj: Record<string, string | number | boolean> = {};

    for (const key of formData.keys()) {
      if (key.endsWith("-type")) {
        continue;
      }

      const value = formData.get(key);
      const valueType = formData.get(`${key}-type`);

      switch (valueType) {
        case "number":
          const number = parseFloat(value as string);

          if (!isNaN(number)) {
            obj[key] = number;
          }
          break;
        case "boolean":
          obj[key] = value === "true";
          break;
        default:
          obj[key] = value as string;
      }
    }

    return obj as T;
  }
}
