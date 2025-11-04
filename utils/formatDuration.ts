export function formatDuration(duration: string): string {
  const parsed = parseInt(duration.replace(/\D/g, ""), 10);

  if (isNaN(parsed) || parsed <= 0) return duration;

  const hours = Math.floor(parsed / 60);
  const minutes = parsed % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} mins`;
  }

  if (hours > 0) {
    return `${hours} hr`;
  }

  return `${minutes} mins`;
}
