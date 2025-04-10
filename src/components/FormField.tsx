// src/components/FormField.tsx
import React from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Check, AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string; // Kept for interface consistency
  error?: string;
  value?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  // name is removed from the function params to resolve the TypeScript error
  error,
  value,
  children,
}) => {
  const getInputStatus = () => {
    if (error) return "error";
    if (value && value.trim()) return "valid";
    return "default";
  };

  const getStatusStyles = () => {
    switch (getInputStatus()) {
      case "error":
        return "border-red-500 focus:border-red-500 focus:ring-red-200";
      case "valid":
        return "border-green-500 focus:border-green-500 focus:ring-green-200";
      default:
        return "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          className: `w-full p-2 border rounded-md transition-colors pr-10 ${getStatusStyles()} ${
            (children as React.ReactElement).props.className || ""
          }`,
        })}

        {/* Status indicators */}
        {getInputStatus() === "valid" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <Check className="h-5 w-5" />
          </span>
        )}
        {getInputStatus() === "error" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="h-5 w-5" />
          </span>
        )}
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="mt-1 py-1 text-sm animate-fadeIn"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormField;