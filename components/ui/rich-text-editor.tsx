"use client";

import dynamic from "next/dynamic";
import React from "react";
import * as ReactDOM from "react-dom";
import "react-quill/dist/quill.snow.css";

// Polyfill ReactDOM.findDOMNode if it's missing in the environment
// ReactQuill internally uses findDOMNode; some builds/environments may not
// provide it on the default react-dom import. Provide a best-effort fallback.
if (typeof (ReactDOM as any).findDOMNode !== "function") {
  (ReactDOM as any).findDOMNode = (instance: any) => {
    if (!instance) return null;
    // If instance exposes getEditor (ReactQuill ref), return editor root
    try {
      if (typeof instance.getEditor === "function") {
        const editor = instance.getEditor();
        if (editor && editor.root) return editor.root as HTMLElement;
      }
      // If instance looks like an HTMLElement, return it
      if (instance instanceof HTMLElement) return instance;
      // Fallback to `.editor.root` if present
      if (instance.editor && instance.editor.root) return instance.editor.root;
    } catch (e) {
      return null;
    }
    return null;
  };
}

// Dynamically import react-quill default export to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill").then((m) => (m as any).default), {
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
  const Q = ReactQuill as any;
  return (
    <Q
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
  );
}
