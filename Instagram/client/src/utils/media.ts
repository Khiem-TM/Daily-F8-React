export const getMediaBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return "https://instagram.f8team.dev";
};

export const getMediaUrl = (path: string | null | undefined): string => {
  if (!path) {
    return getPlaceholderUrl();
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getMediaBaseUrl()}${path}`;
};

export const getPlaceholderUrl = (text: string = "No Image"): string => {
  return `https://placehold.co/400x400/1a1a1a/666?text=${encodeURIComponent(
    text
  )}`;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackText: string = "Image Not Found"
): void => {
  const target = e.target as HTMLImageElement;
  if (!target.dataset.error) {
    target.dataset.error = "true";
    target.src = `https://placehold.co/400x400/1a1a1a/666?text=${encodeURIComponent(
      fallbackText
    )}`;
  }
};
