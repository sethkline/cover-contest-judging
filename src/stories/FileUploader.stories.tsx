// src/stories/FileUploader.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUploader } from "../components/ui/FileUploader";
import { FormField } from "../components/ui/FormField";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { BaseButton } from "../components/ui/BaseButton";
import { Alert } from "../components/ui/Alert";

const meta: Meta<typeof FileUploader> = {
  title: "Form/FileUploader",
  component: FileUploader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "image"],
    },
    multiple: {
      control: "boolean",
    },
    previewImages: {
      control: "boolean",
    },
    dragAndDrop: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    accept: {
      control: "text",
    },
    maxSize: {
      control: "number",
    },
    maxFiles: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  args: {
    label: "Upload file",
    description: "PNG, JPG or PDF, file size no more than 5MB",
    accept: "image/*,application/pdf",
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    label: "Upload file",
    accept: "image/*,application/pdf",
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export const ImageUploader: Story = {
  args: {
    variant: "image",
    label: "Upload Image",
    description: "PNG or JPG, max 5MB",
    accept: "image/*",
    maxSize: 5 * 1024 * 1024, // 5MB
    previewImages: true,
  },
};

export const Multiple: Story = {
  args: {
    label: "Upload files",
    description: "Upload up to 3 files",
    multiple: true,
    maxFiles: 3,
    accept: "image/*,application/pdf",
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export const Disabled: Story = {
  args: {
    label: "Upload disabled",
    description: "This uploader is currently disabled",
    disabled: true,
  },
};

export const WithFormField: Story = {
  render: function Render() {
    const [file, setFile] = useState<File | null>(null);

    return (
      <div className="w-80">
        <FormField
          label="Contest Entry Image"
          helpText="Upload a high-quality image of the artwork. PNG or JPG, max 5MB."
          required
        >
          <FileUploader
            variant="image"
            label="Upload image"
            description="Drag and drop or click to browse"
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            onChange={(files) =>
              setFile(Array.isArray(files) ? files[0] : files)
            }
          />
        </FormField>
      </div>
    );
  },
};

export const ContestEntryForm: Story = {
  render: function Render() {
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!frontImage) {
        setError("Please upload a front image for the entry");
        return;
      }

      // Simulate submission
      setSuccess(true);
      setError(null);

      // In a real app, you would submit the form data to your backend here
      console.log("Submitted:", { frontImage, backImage });
    };

    return (
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Add New Contest Entry</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" onClose={() => setSuccess(false)}>
                Entry uploaded successfully!
              </Alert>
            )}

            <FormField
              label="Front Image"
              helpText="Upload the front side of the contest entry"
              required
            >
              <FileUploader
                variant="image"
                label="Upload front image"
                description="PNG or JPG, max 5MB"
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onChange={(files) => {
                  setFrontImage(Array.isArray(files) ? files[0] : files);
                  setSuccess(false);
                }}
                onError={(err) => setError(err)}
              />
            </FormField>

            <FormField
              label="Back Image (Optional)"
              helpText="Upload the back side of the contest entry if available"
            >
              <FileUploader
                variant="compact"
                label="Upload back image"
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onChange={(files) => {
                  setBackImage(Array.isArray(files) ? files[0] : files);
                  setSuccess(false);
                }}
                onError={(err) => setError(err)}
              />
            </FormField>
          </CardContent>

          <CardFooter>
            <BaseButton type="submit" className="w-full">
              Submit Entry
            </BaseButton>
          </CardFooter>
        </form>
      </Card>
    );
  },
};

export const BulkUpload: Story = {
  render: function Render() {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);

    const handleFilesChange = (newFiles: File | File[] | null) => {
      if (newFiles) {
        const fileArray = Array.isArray(newFiles) ? newFiles : [newFiles];
        setFiles(fileArray);
        setUploadComplete(false);
      } else {
        setFiles([]);
      }
    };

    const handleUpload = () => {
      if (files.length === 0) return;

      setUploading(true);

      // Simulate upload delay
      setTimeout(() => {
        setUploading(false);
        setUploadComplete(true);

        // In a real app, you would upload the files to your backend here
        console.log("Uploaded files:", files);
      }, 2000);
    };

    return (
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Bulk Upload Entries</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {uploadComplete && (
            <Alert variant="success" onClose={() => setUploadComplete(false)}>
              Successfully uploaded {files.length} entries!
            </Alert>
          )}

          <FileUploader
            variant="default"
            label="Upload multiple entry images"
            description="Upload up to 10 images at once. PNG or JPG, max 5MB each."
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            multiple
            maxFiles={10}
            onChange={handleFilesChange}
          />

          {files.length > 0 && (
            <div className="pt-2 text-sm text-neutral-500 dark:text-neutral-400">
              {files.length} {files.length === 1 ? "file" : "files"} selected
            </div>
          )}
        </CardContent>

        <CardFooter>
          <BaseButton
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </BaseButton>
        </CardFooter>
      </Card>
    );
  },
};
