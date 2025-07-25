import { FileText } from "lucide-react";

export function Header() {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-blue-600 p-3 rounded-xl">
          <FileText role="img" aria-label="Icone de documento" className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Tradutor de Documentos
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Traduza seus documentos usando a API do DeepL
      </p>
    </div>
  );
}
