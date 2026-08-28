/**
 * Computes the percentage of completed lessons for a course.
 *
 * @param completedCount - Number of completed lessons
 * @param totalCount - Total number of published lessons in the course
 * @returns Progress percentage as an integer between 0 and 100
 */
export function computeProgress(completedCount: number, totalCount: number): number {
  if (!totalCount || totalCount <= 0) {
    return 0;
  }
  const percentage = Math.round((completedCount / totalCount) * 100);
  return Math.min(100, Math.max(0, percentage));
}
