"use client";
import { useRef } from "react";

export default function SearchBar({ value, onChange, placeholder = "Buscar..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-white/60" />
      </div>
      <input
        ref={inputRef}
        className="input pl-10 pr-12 text-base"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button
          aria-label="Limpiar"
          className="absolute inset-y-0 right-2 my-1 px-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

