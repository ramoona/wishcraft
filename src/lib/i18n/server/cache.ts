import { cache } from "react";
import "server-only";

// eslint-disable-next-line no-restricted-imports
import { getServerTranslations as getServerTranslationsPrimitive } from "./translations";

export const getServerTranslations = cache(getServerTranslationsPrimitive);
