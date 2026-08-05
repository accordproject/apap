// SDK 2.0 (@modelcontextprotocol/server) does not yet declare ttlMs / cacheScope
// on ReadResourceResult contents, but the protocol pass-through serialises
// whatever is on the wire. This augmentation gates SEP-2549 (CacheableResult).
// See blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate
declare module '@modelcontextprotocol/server' {
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
