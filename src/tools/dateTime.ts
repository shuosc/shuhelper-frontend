import {_, partial} from '@/tools/partial';
import {jsonStringToObject} from 'json-interface2class';
import {isWithinInterval, subMilliseconds} from "date-fns";

export function createTime(hours: number, minutes: number, seconds = 0): Date {
  return new Date(0, 0, 0, hours, minutes, seconds);
}

export function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

export function mergeDateTime(date: Date, time: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
    time.getHours(), time.getMinutes(), time.getSeconds());
}

export function extractTime(dateTime: Date): Date {
  return createTime(dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds());
}

export function extractDate(dateTime: Date): Date {
  return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate());
}

export function isWithInIntervalExclusiveEnd(dateTime: Date, interval: Interval) {
  return isWithinInterval(dateTime, {start: interval.start, end: subMilliseconds(interval.end, 1)})
}

export const dateRegex = /((\d{4})|([+-]?\d{6}))-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}((\.\d{3})?Z)|(\+\d{2}:\d{2})/;
const config = new Map<(obj: any) => boolean, (obj: any) => any>();
config.set(dateRegex.test.bind(dateRegex), (str: string) => new Date(str));

export const parseDateTimeInJSON = partial(jsonStringToObject, _, config);
