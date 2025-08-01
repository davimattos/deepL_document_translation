import { Props } from "./types";

export function LanguageSelector({
  languages,
  sourceLanguages,
  source,
  target
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Configuração
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sourceLanguage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Idioma de Origem
            </label>
            <select
              id="sourceLanguage"
              value={source.sourceLanguage}
              onChange={(e) => source.setSourceLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {sourceLanguages.map((lang: any) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecione o idioma do documento original
            </p>
          </div>

          <div>
            <label
              htmlFor="targetLanguage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Idioma de Destino
            </label>
            <select
              id="targetLanguage"
              value={target.targetLanguage}
              onChange={(e) => target.setTargetLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              {languages.map((lang: any) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
