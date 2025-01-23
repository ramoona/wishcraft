"use client";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { ImageBroken } from "@phosphor-icons/react";

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-fit">
        <Alert>
          <AlertTitle className="flex items-center gap-2">
            <ImageBroken className="size-5" /> {"Not Found"}
          </AlertTitle>
          <AlertDescription>
            Well, this is awkward...but this page does not exist. Is there maybe a typo in your URL?
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

export default NotFoundPage;
