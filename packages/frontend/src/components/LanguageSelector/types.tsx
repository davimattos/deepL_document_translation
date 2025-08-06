export type Props = {
  languages: any
  sourceLanguages: any
  source: {
    setSourceLanguage: (value: string) => void
    sourceLanguage: string
  },
  target: {
    setTargetLanguage: (value: string) => void
    targetLanguage: string
  }
}