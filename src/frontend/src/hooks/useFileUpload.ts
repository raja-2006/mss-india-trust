import { HttpAgent } from "@icp-sdk/core/agent";
import { useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setProgress(0);
    try {
      const config = await loadConfig();
      const agent = HttpAgent.createSync({ host: config.backend_host });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey();
      }
      const client = new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) => setProgress(pct));
      return hash;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress };
}

export async function getBlobUrl(blobId: string): Promise<string> {
  const config = await loadConfig();
  const agent = HttpAgent.createSync({ host: config.backend_host });
  const client = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return client.getDirectURL(blobId);
}
