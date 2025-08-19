"use client";

import dynamic from "next/dynamic";
import React from "react";
import "react-quill/dist/quill.snow.css";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  modules?: any;
  formats?: string[];
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  modules,
  formats,
  placeholder,
}: RichTextEditorProps) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
}
