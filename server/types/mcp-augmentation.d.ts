// SDK 1.x does not yet declare ttlMs / cacheScope on ReadResourceResult contents,
// but the protocol pass-through serialises whatever is on the wire. This
// augmentation gates SEP-2549 (CacheableResult) without waiting for SDK 2.0.
// See blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
declare module '@modelcontextprotocol/sdk/types.js' {
  interface TextResourceContents {
    ttlMs?: number;
    cacheScope?: 'public' | 'private';
  }
  interface BlobResourceContents {
    ttlMs?: number;
    cacheScope?: 'public' | 'private';
  }
}

export {};
