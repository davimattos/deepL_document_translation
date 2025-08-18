import { ProcessingState } from "../../App";

export type Props = {
  processing: ProcessingState;
  processFile: () => void;
  setProcessing: (value: any) => void;
  setErrorMessage: (value: string) => void;
  errorMessage: string;
};
