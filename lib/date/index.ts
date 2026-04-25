import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { uk } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";

type DateInput = Date | string | number;

export const DEFAULT_TIME_ZONE = "Europe/Kyiv";

const toDate = (value: DateInput): Date => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    return parseISO(value);
  }

  return new Date(value);
};

const ensureValidDate = (value: DateInput): Date => {
  const parsedDate = toDate(value);

  if (!isValid(parsedDate)) {
    throw new Error("Invalid date value passed to formatter.");
  }

  return parsedDate;
};

export const formatDateTime = (
  value: DateInput,
  pattern = "dd.MM.yyyy HH:mm",
  timeZone = DEFAULT_TIME_ZONE,
): string => {
  return formatInTimeZone(ensureValidDate(value), timeZone, pattern);
};

export const formatDateOnly = (
  value: DateInput,
  pattern = "dd.MM.yyyy",
  timeZone = DEFAULT_TIME_ZONE,
): string => {
  return formatInTimeZone(ensureValidDate(value), timeZone, pattern);
};

export const formatRelativeTime = (value: DateInput): string => {
  return formatDistanceToNowStrict(ensureValidDate(value), {
    addSuffix: true,
    locale: uk,
  });
};

export const formatDurationSeconds = (seconds: number): string => {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDateWithPattern = (value: DateInput, pattern: string): string => {
  return format(ensureValidDate(value), pattern);
};
