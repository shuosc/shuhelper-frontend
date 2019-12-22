import 'mocha';
import {expect} from 'chai';

import {createDate, createTime, mergeDateTime, parseDateTimeInJSON} from "@/tools/dateTime";
import {format} from "date-fns";
import {zhCN} from "date-fns/locale";

describe('dateTime Test', () => {
  it('createDate & createTime & mergeDateTime', () => {
    const date = createDate(2019, 12, 21);
    const time = createTime(10, 30);
    const dateTime = mergeDateTime(date, time);
    const formatted = format(dateTime, "yyyy-MM-dd H:mm", {locale: zhCN});
    expect(formatted).eq('2019-12-21 10:30');
  });
  it('parseDateTimeInJSON', () => {
    const date = createDate(2019, 12, 21);
    const time = createTime(10, 30);
    const dateTime = mergeDateTime(date, time);
    const json = JSON.stringify(dateTime);
    const parsed = parseDateTimeInJSON(JSON.parse(json));
    const formatted = format(parsed, "yyyy-MM-dd H:mm", {locale: zhCN});
    expect(formatted).eq('2019-12-21 10:30');
  });
});
