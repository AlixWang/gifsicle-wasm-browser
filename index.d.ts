export type InputFileSource = string | Blob | File | ArrayBuffer;

export interface InputItem {
	file: InputFileSource;
	name: string;
	[key: string]: unknown;
}

export type CommandItem = string;

export interface RunOptions {
	input?: InputItem[];
	command?: CommandItem[];
	folder?: string[];
	isStrict?: boolean;
	timeout?: number;
	start?: (files: InputItem[]) => void;
}

export interface ToolApi {
	workerLocalUrl: string;
	workerBlobUrl: string;
	worker(): string;
	errorLink(): string;
	testType(data: unknown): string;
	textToUrl(text?: string): Promise<string>;
	loadCommand(command: CommandItem[]): string[];
	loadOne(file: InputFileSource): Promise<ArrayBuffer>;
	loadFile(input: InputItem[]): Promise<InputItem[]>;
	loadFolder(arr: string[]): Promise<string[]>;
}

export interface GifsicleApi {
	tool: ToolApi;
	run(options?: RunOptions): Promise<File[] | null>;
}

declare const gifsicle: GifsicleApi;

export default gifsicle;
