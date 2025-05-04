"use client";

import { ErrorMessage } from "~/components/ErrorMessage";

function NotFoundPage() {
  return <ErrorMessage errorCode="USER_NOT_FOUND" errorMessage="Not found error" />;
}

export default NotFoundPage;
