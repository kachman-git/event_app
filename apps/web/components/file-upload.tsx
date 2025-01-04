"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  isUploading: boolean
}

export function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUpload(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        onClick={handleClick}
        disabled={isUploading}
        variant="outline"
        className="space-x-2"
      >
        <Upload className="h-4 w-4" />
        <span>{isUploading ? "Uploading..." : "Upload Avatar"}</span>
      </Button>
    </div>
  )
}

