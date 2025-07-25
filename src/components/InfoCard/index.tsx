import { Props } from "./types";

export function InfoCard({icon, title, description, className = 'bg-gray-100'}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${className}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}
