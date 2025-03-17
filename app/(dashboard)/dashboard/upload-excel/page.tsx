"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      const response = await axios.post("/api/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the API response has the structure { data: ... }
      setResult(response.data.data);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 p-6 border border-gray-300 rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        Upload Excel File
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="file" className="block mb-2 text-sm text-gray-700">
            Choose Excel File
          </Label>
          <Input
            id="file"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-500 text-white"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {/* Display result if available */}
      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Upload Result:
          </h3>
          <pre className="text-sm text-gray-700 mt-2">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Display error message */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
