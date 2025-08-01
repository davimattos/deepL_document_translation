import { ProcessingState } from "../../App";

export type Props = {
  processing: ProcessingState;
  processFile: () => void;
  apiKey: string;
  setProcessing: (value: any) => void;
  setErrorMessage: (value: string) => void;
  errorMessage: string;
};
