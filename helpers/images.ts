// Resize an image for thumbnail purposes
export const getThumbnailUrl = (
  originalUrl?: string,
  size?: number,
  quality?: number
): string => {
  if (!originalUrl) return "";

  const encodedUrl = encodeURIComponent(originalUrl);

  // Force a tiny dimension
  // w=400:  Resize width to 400px (standard thumbnail size)
  // q=20:   Set quality to 20% (Aggressive compression for testing)
  return `https://wsrv.nl/?url=${encodedUrl}&w=${size}&q=${quality}&output=webp`;
};
