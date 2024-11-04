import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { YtDetails } from "./models/stream"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /* @ts-expect-error */
export function parseYtData(details) {
  const foo : YtDetails = {title : details?.items[0]?.snippet?.title ?? "" , thumbnail : details?.items[0]?.snippet?.thumbnails?.high?.url ?? ""}
  return foo;
}

export const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;