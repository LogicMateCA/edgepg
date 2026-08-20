const OMITTED_HEADERS = new Set([
  "connection",
  "content-length",
  "set-cookie",
  "transfer-encoding",
]);

export async function responseToEntry(response, { maxBodyBytes }) {
  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > maxBodyBytes) return null;
  const bytes = new Uint8Array(await response.clone().arrayBuffer());
  if (bytes.byteLength > maxBodyBytes) return null;
  return {
    status: response.status,
    statusText: response.statusText,
    headers: [...response.headers.entries()]
      .filter(([name]) => !OMITTED_HEADERS.has(name.toLowerCase())),
    body: bytesToBase64(bytes),
  };
}

export function entryToResponse(entry) {
  return new Response(base64ToBytes(entry.body), {
    status: entry.status,
    statusText: entry.statusText,
    headers: entry.headers,
  });
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
