import { z } from "zod";
import { TypedFormData } from "./typed-form-data";

const WishSchema = z.object({
  name: z.string(),
  price: z.number(),
  isPrivate: z.boolean().optional(),
  comment: z.string().optional().nullable(),
});

type Wish = z.infer<typeof WishSchema>;

describe("TypedFormData", () => {
  describe("constructor", () => {
    it("should create instance with schema", () => {
      const typedFormData = new TypedFormData(WishSchema);
      expect(typedFormData).toBeInstanceOf(TypedFormData);
    });
  });

  describe("fromObject", () => {
    it("should serialize string values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user: Wish = {
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
      };

      const formData = typedFormData.fromObject(user);

      expect(formData.get("name")).toBe("Yellow Umbrella");
      expect(formData.get("name-type")).toBe("string");
    });

    it("should serialize number values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user: Wish = {
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
      };

      const formData = typedFormData.fromObject(user);

      expect(formData.get("price")).toBe("30");
      expect(formData.get("price-type")).toBe("number");
    });

    it("should serialize boolean values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user: Wish = {
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
      };

      const formData = typedFormData.fromObject(user);

      expect(formData.get("isPrivate")).toBe("true");
      expect(formData.get("isPrivate-type")).toBe("boolean");
    });

    it("should skip null and undefined values", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user = {
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
        comment: null as string | null,
        extra: undefined as string | undefined,
      };

      const formData = typedFormData.fromObject(user);

      expect(formData.get("comment")).toBeNull();
      expect(formData.get("comment-type")).toBeNull();
      expect(formData.get("extra")).toBeNull();
      expect(formData.get("extra-type")).toBeNull();
    });
  });

  describe("toObject", () => {
    it("should deserialize string values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "true");
      formData.append("isPrivate-type", "boolean");

      const result = typedFormData.toObject(formData);

      expect(result).toEqual({
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
      });
    });

    it("should deserialize number values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "true");
      formData.append("isPrivate-type", "boolean");

      const result = typedFormData.toObject(formData);

      expect(result.price).toBe(30);
      expect(typeof result.price).toBe("number");
    });

    it("should deserialize boolean values correctly", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "true");
      formData.append("isPrivate-type", "boolean");

      const result = typedFormData.toObject(formData);

      expect(result.isPrivate).toBe(true);
      expect(typeof result.isPrivate).toBe("boolean");
    });

    it("should handle false boolean values", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "false");
      formData.append("isPrivate-type", "boolean");

      const result = typedFormData.toObject(formData);

      expect(result.isPrivate).toBe(false);
    });

    it("should ignore type metadata keys", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "true");
      formData.append("isPrivate-type", "boolean");

      const result = typedFormData.toObject(formData);

      expect(result).not.toHaveProperty("name-type");
      expect(result).not.toHaveProperty("price-type");
      expect(result).not.toHaveProperty("isPrivate-type");
    });
  });

  describe("schema validation", () => {
    it("should throw error for invalid data", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      // Missing required field  'price'

      expect(() => typedFormData.toObject(formData)).toThrow("INVALID_VALUE");
    });

    it("should pass validation for valid data", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const formData = new FormData();
      formData.append("name", "Yellow Umbrella");
      formData.append("name-type", "string");
      formData.append("price", "30");
      formData.append("price-type", "number");
      formData.append("isPrivate", "true");
      formData.append("isPrivate-type", "boolean");

      expect(() => typedFormData.toObject(formData)).not.toThrow();
    });
  });

  describe("round-trip serialization", () => {
    it("should maintain data integrity through serialize-deserialize cycle", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const originalUser: Wish = {
        name: "Yellow Umbrella",
        price: 30,
        isPrivate: true,
        comment: "john@example.com",
      };

      const formData = typedFormData.fromObject(originalUser);
      const deserializedUser = typedFormData.toObject(formData);

      expect(deserializedUser).toEqual(originalUser);
    });
  });

  describe("edge cases", () => {
    it("should handle empty object", () => {
      const typedFormData = new TypedFormData(z.object({}));
      const emptyObj = {};

      const formData = typedFormData.fromObject(emptyObj);
      const result = typedFormData.toObject(formData);

      expect(result).toEqual({});
    });

    it("should handle zero values", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user = {
        name: "Yellow Umbrella",
        price: 0,
        isPrivate: false,
      };

      const formData = typedFormData.fromObject(user as Wish);
      const result = typedFormData.toObject(formData);

      expect(result.price).toBe(0);
      expect(result.isPrivate).toBe(false);
    });

    it("should handle empty strings", () => {
      const typedFormData = new TypedFormData(WishSchema);
      const user = {
        name: "",
        price: 30,
        isPrivate: true,
      };

      const formData = typedFormData.fromObject(user as Wish);
      const result = typedFormData.toObject(formData);

      expect(result.name).toBe("");
    });
  });
});
