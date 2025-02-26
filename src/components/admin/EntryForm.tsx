// src/components/admin/EntryForm.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EntryForm() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit entry");

      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}
