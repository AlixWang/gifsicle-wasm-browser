// src/index.ts
var ERROR_LINK = "See https://github.com/renzhezhilu/gifsicle-wasm-browser";
var defaultWorkerUrl = new URL("./worker.js", import.meta.url).toString();
var isArray = Array.isArray;
var assertBrowser = () => {
  if (typeof Worker === "undefined" || typeof Blob === "undefined") {
    throw new Error("gifsicle-wasm-browser can only run in modern browsers");
  }
};
var normalizeCommands = (commands) => {
  if (!isArray(commands) || commands.length === 0) {
    throw new Error("<command> must be a non-empty array. " + ERROR_LINK);
  }
  return commands.map((command) => command.replace(/\n/g, " ").trim()).filter(Boolean);
};
var normalizeFolder = (folder) => {
  if (folder == null) return [];
  if (!isArray(folder)) {
    throw new Error("<folder> must be an array. " + ERROR_LINK);
  }
  return folder;
};
var toArrayBuffer = async (file) => {
  if (typeof file === "string") {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`<input.file> "${file}" could not be loaded. ${ERROR_LINK}`);
    }
    return response.arrayBuffer();
  }
  if (file instanceof ArrayBuffer) return file;
  if (file instanceof Blob) return file.arrayBuffer();
  throw new Error(
    "<input.file> must be a url string, Blob, File, or ArrayBuffer. " + ERROR_LINK
  );
};
var loadFiles = async (input) => {
  if (!isArray(input) || input.length === 0) {
    throw new Error("<input> must be a non-empty array. " + ERROR_LINK);
  }
  const tasks = input.map(async (item) => {
    if (!item?.name) {
      throw new Error("<input.name> is required for every file. " + ERROR_LINK);
    }
    const buffer = await toArrayBuffer(item.file);
    return { name: item.name, file: buffer };
  });
  return Promise.all(tasks);
};
var createWorker = (workerUrl) => {
  const url = workerUrl ? workerUrl.toString() : defaultWorkerUrl;
  return new Worker(url, { type: "module" });
};
var toFiles = (data) => {
  return data.map((item) => {
    const isText = item.name.endsWith(".txt");
    const view = item.file;
    const backingBuffer = view.buffer;
    const buffer = view.byteOffset === 0 && view.byteLength === backingBuffer.byteLength ? backingBuffer : backingBuffer.slice(
      view.byteOffset,
      view.byteOffset + view.byteLength
    );
    const blob = new Blob([buffer], {
      type: isText ? "text/plain" : "image/gif"
    });
    return new File([blob], item.name, { type: blob.type });
  });
};
var run = async ({
  input,
  command,
  folder,
  isStrict = false,
  workerUrl,
  timeoutMs,
  onStart,
  start
}) => {
  assertBrowser();
  const files = await loadFiles(input);
  const commands = normalizeCommands(command);
  const folders = normalizeFolder(folder);
  (onStart || start)?.(files);
  return new Promise((resolve, reject) => {
    const worker = createWorker(workerUrl);
    let timeout;
    const cleanup = () => {
      worker.terminate();
      if (timeout) clearTimeout(timeout);
    };
    if (typeof timeoutMs === "number" && timeoutMs > 0) {
      timeout = setTimeout(() => {
        cleanup();
        reject(new Error("gifsicle worker timed out"));
      }, timeoutMs);
    }
    worker.onmessage = (event) => {
      const payload = event.data;
      if (!payload?.success) {
        cleanup();
        reject(
          new Error(
            payload?.error || "Unknown worker failure. " + ERROR_LINK
          )
        );
        return;
      }
      const output = toFiles(payload.files);
      cleanup();
      resolve(output);
    };
    worker.onerror = (event) => {
      cleanup();
      reject(event.error || event.message || event);
    };
    const workerPayload = {
      data: files,
      command: commands,
      folder: folders,
      isStrict
    };
    const transfer = files.map((item) => item.file);
    worker.postMessage(workerPayload, transfer);
  });
};
var gifsicle = { run };
var index_default = gifsicle;

export { index_default as default, run };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map