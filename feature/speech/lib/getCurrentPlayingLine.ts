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

function getTimedLines(
  lines: { line: number; timeSeconds: number | null }[],
): { line: number; timeSeconds: number }[] {
  return lines
    .filter(
      (item): item is { line: number; timeSeconds: number } =>
        item.timeSeconds != null,
    )
    .slice()
    .sort((a, b) => a.timeSeconds - b.timeSeconds);
}

/**
 * Resolve the active line for playback.
 * Ignores lines without timestamps and rescales estimated timelines
 * when they clearly don't match the real audio duration (e.g. Chirp/Gemini).
 */
export function getActivePlayingLine(
  lines: { line: number; timeSeconds: number | null }[],
  currentTime: number,
  audioDuration?: number,
): number | null {
  const timed = getTimedLines(lines);

  if (!timed.length) {
    return null;
  }

  let progress = currentTime;
  const lastStart = timed[timed.length - 1]?.timeSeconds ?? 0;

  // Estimated timestamps can be longer than the real audio; map playback into that timeline.
  if (audioDuration && audioDuration > 0 && lastStart > audioDuration) {
    progress = (currentTime / audioDuration) * lastStart;
  }

  return getCurrentPlayingLine(timed, progress);
}

/**
 * Convert a stored line timestamp into real audio currentTime.
 * Inverse of the rescale used in getActivePlayingLine.
 */
export function getAudioTimeForLine(
  lines: { line: number; timeSeconds: number | null }[],
  lineNumber: number,
  audioDuration?: number,
): number | null {
  const timed = getTimedLines(lines);
  const target = timed.find((item) => item.line === lineNumber);

  if (!target) {
    return null;
  }

  const lastStart = timed[timed.length - 1]?.timeSeconds ?? 0;

  if (audioDuration && audioDuration > 0 && lastStart > audioDuration) {
    return (target.timeSeconds / lastStart) * audioDuration;
  }

  return target.timeSeconds;
}
