"use client";

import { WishForm } from "~/components/wishlist/WishForm";
import { useState } from "react";

export function AddNewWish() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Add new</button>
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
