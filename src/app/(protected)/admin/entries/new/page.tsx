// src/app/(protected)/admin/entries/new/page.tsx
"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewEntryPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    contestType: "cover",
    participantName: "",
    age: "",
    ageCategory: "3-7",
    artistStatement: "",
    frontImage: null as File | null,
    backImage: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState({
    front: "",
    back: "",
  });

  const [ageCategories, setAgeCategories] = useState([]);

  useEffect(() => {
    const fetchAgeCategories = async () => {
      const { data, error } = await supabase
        .from("age_categories")
        .select("id, name, min_age, max_age");
  
      if (data) {
        setAgeCategories(data);
      }
    };
    fetchAgeCategories();
  }, []);
  
  // Add this function to get the correct age category ID
  const getAgeCategoryId = (age) => {
    const numAge = parseInt(age);
    const category = ageCategories.find(cat => 
      numAge >= cat.min_age && 
      (cat.max_age === null || numAge <= cat.max_age)
    );
    return category?.id;
  };
  

  type Contest = {
    id: string;
    name: string;
    type: string;
    is_active: boolean;
  };

  const [contests, setContests] = useState<Contest[]>([]);


  useEffect(() => {
    const fetchContests = async () => {
      const { data, error } = await supabase
        .from("contests")
        .select("id, name, type, is_active")
        .eq("is_active", true);

      if (data) {
        setContests(data);
      }
    };
    fetchContests();
  }, []);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type === "front" ? "frontImage" : "backImage"]: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setImagePreview((prev) => ({
        ...prev,
        [type]: url,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session) {
        throw new Error("Not authenticated");
      }

      if (!formData.frontImage) {
        throw new Error("Front image is required");
      }

      // Get contest id
      const contest = contests.find((c) => c.type === formData.contestType);
      if (!contest) {
        throw new Error("Contest type not found");
      }

      // Get the next entry number
      const { data: maxEntryNumber } = await supabase
        .from("entries")
        .select("entry_number")
        .order("entry_number", { ascending: false })
        .limit(1)
        .single();

      const nextEntryNumber = (maxEntryNumber?.entry_number || 0) + 1;

      // Upload front image
      const frontFileName = `${Date.now()}_front.jpg`;
      const { error: frontImageError } = await supabase.storage
        .from("contest-images")
        .upload(frontFileName, formData.frontImage, {
          upsert: false,
          cacheControl: "3600",
          contentType: formData.frontImage.type,
        });

      if (frontImageError) throw frontImageError;

      // Upload back image if exists
      let backFileName = null;
      if (formData.backImage) {
        backFileName = `${Date.now()}_back.jpg`;
        const { error: backImageError } = await supabase.storage
          .from("contest-images")
          .upload(backFileName, formData.backImage, {
            upsert: false,
            cacheControl: "3600",
            contentType: formData.backImage.type,
          });

        if (backImageError) throw backImageError;
      }

      // Create entry record
      const { error: entryError } = await supabase.from("entries").insert({
        contest_id: contest.id,
        entry_number: nextEntryNumber,
        participant_name: formData.participantName,
        participant_age: parseInt(formData.age),
        age_category_id: getAgeCategoryId(formData.age),
        artist_statement: formData.artistStatement || null,
        front_image_path: frontFileName,
        back_image_path: backFileName,
      });

      if (entryError) {
        console.error("Entry Error:", entryError);
        throw entryError;
      }

      router.push("/admin/entries");
      router.refresh();
    } catch (error) {
      console.error("Submission Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Entry</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contest Type
          </label>
          <select
            value={formData.contestType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contestType: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="cover">Cover Design</option>
            <option value="bookmark">Bookmark Design</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Participant Name
          </label>
          <input
            type="text"
            required
            value={formData.participantName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                participantName: e.target.value,
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            required
            min="3"
            value={formData.age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, age: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {formData.contestType === "cover" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age Category
            </label>
            <select
              value={formData.ageCategory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ageCategory: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="3-7">Ages 3-7</option>
              <option value="8-11">Ages 8-11</option>
              <option value="12+">Ages 12+</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Artist Statement (Optional)
          </label>
          <textarea
            value={formData.artistStatement}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                artistStatement: e.target.value,
              }))
            }
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Front Image
          </label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleImageChange(e, "front")}
            className="mt-1 block w-full"
          />
          {imagePreview.front && (
            <img
              src={imagePreview.front}
              alt="Front preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Back Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "back")}
            className="mt-1 block w-full"
          />
          {imagePreview.back && (
            <img
              src={imagePreview.back}
              alt="Back preview"
              className="mt-2 max-h-40 object-contain"
            />
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Add Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
