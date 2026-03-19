export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  // Next.js Image component requires absolute URLs or relative paths starting with /
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}
