import { getMediaBaseUrl } from "./media";

/**
 * Get avatar URL from profilePicture field
 * Handles both full URLs and relative paths
 */
export const getAvatarUrl = (
  profilePicture: string | null | undefined,
  fallbackName: string = "User"
): string => {
  // Handle null, undefined, empty string, or whitespace-only string
  if (!profilePicture || profilePicture.trim() === "") {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fallbackName
    )}&background=random&size=128`;
  }

  // If already a full URL, return as is
  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  // Otherwise, prepend API URL
  return `${getMediaBaseUrl()}${profilePicture}`;
};

/**
 * Get fallback avatar URL
 */
export const getFallbackAvatarUrl = (name: string = "User"): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&size=128`;
};
