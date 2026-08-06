export function getCurrentPlayingLine(
  linesWithTime: { line: number; timeSeconds: number }[],
  currentTime: number,
): number | null {
  if (!linesWithTime.length) return null;

  let lastLine: number | null = null;

  for (const item of linesWithTime) {
    if (item.timeSeconds <= currentTime) {
      lastLine = item.line;
    } else {
      break;
    }
  }

  return lastLine;
}
