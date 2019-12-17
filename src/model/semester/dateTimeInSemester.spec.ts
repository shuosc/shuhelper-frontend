import 'mocha';
import {expect} from 'chai';
import {DateTimeInSemester, DateTimeInSemesterService} from "./dateTimeInSemester";
import {toNullable} from "fp-ts/lib/Option";

const testDateTimeInSemester: DateTimeInSemester = {
  dateTime: new Date(2019, 11, 16),
  semester: {
    start: new Date("2019-11-24T00:00:00Z"),
    end: new Date("2020-03-21T00:00:00Z"),
    id: '11',
    name: "2019-2020冬季学期",
    holidays: [{
      start: new Date("2020-01-05T00:00:00Z"),
      end: new Date("2020-02-08T00:00:00Z"),
      id: 1,
      name: "寒假",
      shifts: []
    }, {
      start: new Date("2020-01-01T00:00:00Z"),
      end: new Date("2020-01-02T00:00:00Z"),
      id: 3,
      name: "元旦",
      shifts: []
    }]
  }
};


describe('DateTimeInSemester Test', () => {
  it('getNextHoliday', async () => {
    const nextHoliday = toNullable(DateTimeInSemesterService.getNextHoliday(testDateTimeInSemester))!;
    expect(nextHoliday.name).eq('元旦');
  });
});
