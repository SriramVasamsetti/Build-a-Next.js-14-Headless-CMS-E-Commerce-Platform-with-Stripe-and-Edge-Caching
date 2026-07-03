import { unstable_cache, revalidateTag } from 'next/cache';

// This file provides a wrapper around Next.js's caching utilities.
// It's primarily for demonstration and to centralize cache management.

/**
 * Caches the result of an async function using Next.js's unstable_cache.
 * @param {Function} fn The async function to cache.
 * @param {string[]} keys An array of strings to use as a cache key.
 * @param {Object} options Options for caching, including `tags` and `revalidate`.
 * @returns {Function} A cached version of the input function.
 */
export function cachedFunction(fn, keys, options) {
  return unstable_cache(fn, keys, options);
}

/**
 * Revalidates data associated with a specific cache tag.
 * @param {string} tag The tag to revalidate.
 */
export function invalidateCacheTag(tag) {
  revalidateTag(tag);
}
