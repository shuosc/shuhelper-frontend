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
