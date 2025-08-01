export type Props = {
  handleDrop: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  file: File | null
  fileInputRef: HTMLInputElement | any
  handleFileSelect: (selectedFile: File) => void
  handleExecutedFile: () => void
  allowedExtensions: string[]
}