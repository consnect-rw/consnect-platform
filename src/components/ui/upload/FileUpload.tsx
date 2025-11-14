"use client";

import { useState, useCallback, ReactNode } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogPanel } from "@headlessui/react";
import { uploadSingleImage } from "@/util/s3Helpers";
import { toast } from "sonner";

// You can swap this with your actual uploader function // Must return the uploaded file URL

interface FileUploadProps {
  onUploadComplete: (url: string, file: File) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  name?: string;
  icon?: ReactNode;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  maxSizeMB = 10,
  name = "Upload Document",
  icon,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
      if (!isValidType) {
        toast.error(`File type not allowed: ${file.name}`);
      }
      if (!isValidSize) {
        toast.error(`File too large: ${file.name}`);
      }
      return isValidType && isValidSize;
    });

    if (filteredFiles.length) {
      setSelectedFiles(filteredFiles);
    }
  }, [allowedTypes, maxSizeMB]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: allowedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple,
  });

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    setUploading(true);

    try {
      for (const file of selectedFiles) {
        const url = await uploadSingleImage(file, "consnect-documents");
        if (url) {
          onUploadComplete(url, file);
          toast.success(`${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
      setSelectedFiles([]);
      setIsOpen(false);
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Error during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-[6px] bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap rounded-md flex items-center justify-center gap-2 text-sm"
      >
        {icon ?? null}
        {name}
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex items-center justify-center">
          <DialogPanel className="bg-white w-full md:w-[70%] lg:w-[50%] p-6 rounded-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Document</h2>

            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Allowed types: {allowedTypes.join(", ")} | Max size: {maxSizeMB}MB
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Selected File(s):</h3>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {selectedFiles.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={() => {
                  setSelectedFiles([]);
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={uploading || !selectedFiles.length}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                onClick={handleUpload}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default FileUpload;
