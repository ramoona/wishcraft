"use client";

import { WishForm } from "~/components/wishlist/own/WishForm";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function AddNewWish() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowForm(true)}>Wish something new</Button>
      {showForm && (
        <WishForm
          data={{
            id: "NEW",
            name: "",
            url: null,
            comment: null,
            price: null,
            currency: null,
          }}
        />
      )}
    </div>
  );
}
