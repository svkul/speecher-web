/** Enter the next line slightly before its boundary for perceived sync. */
const HIGHLIGHT_LEAD_SECONDS = 0.2;

type LineInput = {
  line: number;
  text?: string;
  timeSeconds: number | null;
};

type TimedLine = {
  line: number;
  timeSeconds: number;
};

function getPlayableLines(lines: LineInput[]): {
  line: number;
  weight: number;
  timeSeconds: number | null;
}[] {
  return lines
    .map((item) => ({
      line: item.line,
      weight: (item.text ?? "").trim().length,
      timeSeconds: item.timeSeconds,
    }))
    .filter((item) => item.weight > 0);
}

function getStoredStarts(lines: LineInput[]): TimedLine[] {
  return lines
    .filter(
      (item): item is LineInput & { timeSeconds: number } =>
        item.timeSeconds != null && Number.isFinite(item.timeSeconds),
    )
    .map((item) => ({ line: item.line, timeSeconds: item.timeSeconds }))
    .sort((a, b) => a.timeSeconds - b.timeSeconds);
}

/**
 * Build line start times from real audio duration and text length.
 */
function getProportionalStarts(
  playable: { line: number; weight: number }[],
  audioDuration: number,
): TimedLine[] {
  const totalWeight = playable.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0 || !(audioDuration > 0)) {
    return playable.map((item, index) => ({
      line: item.line,
      timeSeconds: index === 0 ? 0 : Number.POSITIVE_INFINITY,
    }));
  }

  let elapsed = 0;

  return playable.map((item) => {
    const start = (elapsed / totalWeight) * audioDuration;
    elapsed += item.weight;
    return {
      line: item.line,
      timeSeconds: start,
    };
  });
}

/**
 * Prefer SSML timestamps from generation when they look real.
 * Fall back to proportional math for Chirp/Gemini (no SSML marks).
 */
function areStoredTimestampsReliable(
  stored: TimedLine[],
  audioDuration?: number,
): boolean {
  if (stored.length === 0) {
    return false;
  }

  // First mark should be near the beginning
  if (stored[0].timeSeconds > 0.35) {
    return false;
  }

  for (let index = 1; index < stored.length; index += 1) {
    if (stored[index].timeSeconds < stored[index - 1].timeSeconds) {
      return false;
    }
  }

  const lastStart = stored[stored.length - 1].timeSeconds;

  if (audioDuration && audioDuration > 0) {
    // Real SSML marks always fit inside the audio; bad estimates often overshoot
    if (lastStart > audioDuration + 0.2) {
      return false;
    }
  }

  return true;
}

function buildLineStartsCacheKey(
  lines: LineInput[],
  audioDuration?: number,
): string {
  const durationKey =
    audioDuration && Number.isFinite(audioDuration) && audioDuration > 0
      ? audioDuration.toFixed(3)
      : "na";

  const linesKey = lines
    .map(
      (item) =>
        `${item.line}:${item.timeSeconds ?? "n"}:${(item.text ?? "").length}`,
    )
    .join("|");

  return `${durationKey}#${linesKey}`;
}

let cachedStartsKey = "";
let cachedStarts: TimedLine[] = [];

function resolveLineStarts(
  lines: LineInput[],
  audioDuration?: number,
): TimedLine[] {
  const cacheKey = buildLineStartsCacheKey(lines, audioDuration);
  if (cacheKey === cachedStartsKey) {
    return cachedStarts;
  }

  const playable = getPlayableLines(lines);
  const stored = getStoredStarts(lines);
  const duration =
    audioDuration && Number.isFinite(audioDuration) && audioDuration > 0
      ? audioDuration
      : undefined;

  let starts: TimedLine[];

  if (areStoredTimestampsReliable(stored, duration)) {
    starts = stored;
  } else if (duration && playable.length > 0) {
    starts = getProportionalStarts(playable, duration);
  } else if (stored.length > 0) {
    starts = stored;
  } else {
    starts = playable.map((item, index) => ({
      line: item.line,
      timeSeconds: index === 0 ? 0 : Number.POSITIVE_INFINITY,
    }));
  }

  cachedStartsKey = cacheKey;
  cachedStarts = starts;
  return starts;
}

export function getCurrentPlayingLine(
  linesWithTime: TimedLine[],
  currentTime: number,
): number | null {
  if (!linesWithTime.length) return null;

  const time = Number.isFinite(currentTime) ? currentTime : 0;
  let lastLine: number | null = linesWithTime[0]?.line ?? null;

  for (const item of linesWithTime) {
    if (item.timeSeconds <= time) {
      lastLine = item.line;
    } else {
      break;
    }
  }

  return lastLine;
}

/**
 * Resolve the active line for playback.
 * Uses generation timestamps when reliable; otherwise proportional fallback.
 */
export function getActivePlayingLine(
  lines: LineInput[],
  currentTime: number,
  audioDuration?: number,
): number | null {
  const starts = resolveLineStarts(lines, audioDuration);
  if (!starts.length) {
    return null;
  }

  const time = Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0;
  const progress = time + HIGHLIGHT_LEAD_SECONDS;
  const cappedProgress =
    audioDuration && audioDuration > 0
      ? Math.min(progress, audioDuration)
      : progress;

  return getCurrentPlayingLine(starts, cappedProgress) ?? starts[0].line;
}

/**
 * Convert a line into real audio currentTime using the same timing source.
 */
export function getAudioTimeForLine(
  lines: LineInput[],
  lineNumber: number,
  audioDuration?: number,
): number | null {
  const starts = resolveLineStarts(lines, audioDuration);
  return starts.find((item) => item.line === lineNumber)?.timeSeconds ?? null;
}
