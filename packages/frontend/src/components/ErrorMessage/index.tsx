import { AlertCircle } from "lucide-react";
import { Props } from "./types";

export function ErrorMessage({ errorMessage }: Props) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle
          data-testid="alert-icon"
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
        />
        <p className="text-red-700 text-sm">{errorMessage}</p>
      </div>
    </div>
  );
}
