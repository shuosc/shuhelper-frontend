import {Holiday} from '@/model/semester/holiday/holiday';
import {eachDayOfInterval} from 'date-fns';
import {DateTimeInSemesterService} from '@/model/semester/dateTimeInSemester';
import {isWithInIntervalExclusiveEnd} from "@/tools/dateTime";

export interface Semester {
  id: string,
  name: string,
  start: Date,
  end: Date,
  holidays: Array<Holiday>
}

export namespace SemesterService {
  /**
   * 获取总的工作日数量
   */
  export function getTotalWorkingDayCount(semester: Semester) {
    return getWorkingDayCount(semester, semester.start, semester.end);
  }

  /**
   * 获取从@arg from 开始到 @arg to 的工作日数量
   */
  export function getWorkingDayCount(semester: Semester, from: Date, to: Date): number {
    const targetRange = {start: from, end: to};
    return eachDayOfInterval(semester)
      .filter((it) => isWithInIntervalExclusiveEnd(it, targetRange))
      .map((it) => {
        return {semester, dateTime: it};
      })
      .filter(DateTimeInSemesterService.isWorkingDay)
      .length;
  }
}
