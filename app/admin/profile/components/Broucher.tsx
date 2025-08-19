"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Trash2,
  Upload,
  FileText,
  Download,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

interface Brochure {
  _id: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
}

export default function Broucher() {
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { toast } = useToast();

  // Fetch brochures
  const fetchBrochures = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/broucher");
      const data = await response.json();
      if (data.brochures) {
        setBrochures(data.brochures);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch brochures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrochures();
  }, []);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  // Handle brochure upload
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch("/api/admin/broucher", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Brochure uploaded successfully",
        });
        // Clear the file input by resetting its value
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        setTimeout(() => {
          setFile(null);
        }, 1000);
        fetchBrochures();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to upload brochure",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle brochure deletion
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/broucher?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Brochure deleted successfully",
        });
        fetchBrochures();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete brochure",
        variant: "destructive",
      });
    }
  };

  // Handle brochure update
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file to update",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch(`/api/admin/broucher?id=${editingId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Brochure updated successfully",
        });
        // Clear the file input by resetting its value
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        setTimeout(() => {
          // Remove the current file label after successful update
          const fileInput = document.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          const label = fileInput?.parentElement?.querySelector(
            ".current-file-label"
          );
          if (label) {
            label.remove();
          }
          setFile(null);
          setEditingId(null);
        }, 1000);
        fetchBrochures();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update brochure",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (brochure: Brochure) => {
    setEditingId(brochure._id);
    // Get the file input element
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      // Create a temporary label to show the current file name
      const label = document.createElement("div");
      label.className = "text-sm text-gray-500 mt-1";
      label.textContent = `Current file: ${brochure.fileName}`;

      // Remove any existing label
      const existingLabel = fileInput.parentElement?.querySelector(
        ".current-file-label"
      );
      if (existingLabel) {
        existingLabel.remove();
      }

      // Add the new label after the input
      label.classList.add("current-file-label");
      fileInput.parentElement?.appendChild(label);
    }
    setFile(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <Card className="p-6">
        <form
          onSubmit={editingId ? handleUpdate : handleUpload}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              PDF File
            </label>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-4">
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Remove the current file label when canceling
                  const fileInput = document.querySelector(
                    'input[type="file"]'
                  ) as HTMLInputElement;
                  const label = fileInput?.parentElement?.querySelector(
                    ".current-file-label"
                  );
                  if (label) {
                    label.remove();
                  }
                  setEditingId(null);
                  setFile(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={uploading}
              className="bg-admin-gradient"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingId ? (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Update Brochure
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Brochure
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Brochures List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Brochures</h2>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : brochures.length === 0 ? (
          <p className="text-center text-gray-500">No brochures uploaded yet</p>
        ) : (
          <div className="grid gap-4">
            {brochures.map((brochure) => (
              <Card key={brochure._id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-gray-400" />
                    <div>
                      <h3 className="font-medium">{brochure.fileName}</h3>
                      <p className="text-sm text-gray-500">
                        Uploaded on{" "}
                        {format(new Date(brochure.uploadDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = brochure.filePath;
                        link.download = brochure.fileName;
                        link.style.display = "none";
                        document.body.appendChild(link);

                        link.click();

                        // Remove link after click
                        setTimeout(() => {
                          document.body.removeChild(link);
                        }, 1500);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(brochure)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(brochure._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
