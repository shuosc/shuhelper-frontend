/* tslint:disable:no-unused-expression */
import 'mocha';
import {expect} from 'chai';
import {DateTimeInSemester, DateTimeInSemesterService} from "./dateTimeInSemester";
import {toNullable} from "fp-ts/lib/Option";
import {createDate} from "@/tools/dateTime";
import {addHours} from "date-fns";

const testSemester = {
  start: createDate(2019, 11, 24),
  end: createDate(2020, 3, 21),
  id: '11',
  name: "2019-2020冬季学期",
  holidays: [{
    start: createDate(2020, 1, 5),
    end: createDate(2020, 2, 8),
    id: 1,
    name: "寒假",
    shifts: []
  }, {
    start: createDate(2020, 1, 1),
    end: createDate(2020, 1, 2),
    id: 3,
    name: "元旦",
    shifts: []
  }]
};


describe('DateTimeInSemester Test', () => {
  it('getNextHoliday', async () => {
    const testDateTimeInSemester: DateTimeInSemester = {
      dateTime: new Date(2019, 11, 16),
      semester: testSemester
    };
    const nextHoliday = toNullable(DateTimeInSemesterService.getNextHoliday(testDateTimeInSemester))!;
    expect(nextHoliday.name).eq('元旦');
  });
  it('isHoliday', async () => {
    const testDateTimeInSemester: DateTimeInSemester = {
      dateTime: createDate(2019, 12, 31),
      semester: testSemester
    };
    expect(DateTimeInSemesterService.isHoliday(testDateTimeInSemester)).is.false;
    for (let i = 0; i < 5; ++i) {
      testDateTimeInSemester.dateTime = addHours(testDateTimeInSemester.dateTime, 4);
      expect(DateTimeInSemesterService.isHoliday(testDateTimeInSemester)).is.false;
    }
    testDateTimeInSemester.dateTime = addHours(testDateTimeInSemester.dateTime, 4);
    expect(DateTimeInSemesterService.isHoliday(testDateTimeInSemester)).is.true;
    for (let i = 0; i < 5; ++i) {
      testDateTimeInSemester.dateTime = addHours(testDateTimeInSemester.dateTime, 4);
      expect(DateTimeInSemesterService.isHoliday(testDateTimeInSemester)).is.true;
    }
    testDateTimeInSemester.dateTime = addHours(testDateTimeInSemester.dateTime, 4);
    expect(DateTimeInSemesterService.isHoliday(testDateTimeInSemester)).is.false;
  });
});
