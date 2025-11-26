type InputFileSource = string | Blob | File | ArrayBuffer;
type InputFile = {
    file: InputFileSource;
    name: string;
};
type LoadedInputFile = {
    file: ArrayBuffer;
    name: string;
};
type RunOptions = {
    input: InputFile[];
    command: string[];
    folder?: string[];
    isStrict?: boolean;
    workerUrl?: string | URL;
    timeoutMs?: number;
    onStart?: (files: LoadedInputFile[]) => void;
    start?: (files: LoadedInputFile[]) => void;
};
declare const run: ({ input, command, folder, isStrict, workerUrl, timeoutMs, onStart, start, }: RunOptions) => Promise<File[]>;
declare const gifsicle: {
    run: ({ input, command, folder, isStrict, workerUrl, timeoutMs, onStart, start, }: RunOptions) => Promise<File[]>;
};

export { type InputFile, type LoadedInputFile, type RunOptions, gifsicle as default, run };
