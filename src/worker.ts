import gifsicle from "./gifsicle.js";

declare const self: DedicatedWorkerGlobalScope;

type WorkerFile = {
  file: ArrayBuffer;
  name: string;
};

type WorkerMessage = {
  data: WorkerFile[];
  command: string[];
  folder?: string[];
  isStrict?: boolean;
};

type WorkerResponse =
  | { success: true; files: { file: Uint8Array; name: string }[] }
  | { success: false; error: string };

const postFailure = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : typeof error === "string"
      ? error
      : "Unknown worker error";
  const payload: WorkerResponse = { success: false, error: message };
  self.postMessage(payload);
};

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const payload = event.data;

  if (!payload?.data || !payload.command) {
    postFailure("Invalid worker payload");
    return;
  }

  try {
    const files = await gifsicle({
      data: payload.data,
      command: payload.command,
      folder: payload.folder || [],
      isStrict: Boolean(payload.isStrict),
    });

    const transfer = files
      .map((item) => ("buffer" in item.file ? item.file.buffer : undefined))
      .filter(Boolean) as ArrayBuffer[];

    const response: WorkerResponse = { success: true, files };
    self.postMessage(response, transfer);
  } catch (error) {
    postFailure(error);
  }
};
