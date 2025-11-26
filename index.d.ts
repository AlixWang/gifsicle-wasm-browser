export type InputFileSource = string | Blob | File | ArrayBuffer;

export type InputFile = {
  file: InputFileSource;
  name: string;
};

export type LoadedInputFile = {
  file: ArrayBuffer;
  name: string;
};

export type RunOptions = {
  input: InputFile[];
  command: string[];
  folder?: string[];
  isStrict?: boolean;
  workerUrl?: string | URL;
  timeoutMs?: number;
  onStart?: (files: LoadedInputFile[]) => void;
  start?: (files: LoadedInputFile[]) => void;
};

export declare const run: (options: RunOptions) => Promise<File[]>;

declare const gifsicle: {
  run: typeof run;
};

export default gifsicle;
