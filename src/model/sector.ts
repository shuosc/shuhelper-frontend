import {addMinutes} from 'date-fns';
import {fromArray, map, NonEmptyArray, tail} from 'fp-ts/lib/NonEmptyArray';
import {findFirst, findIndex, zip} from 'fp-ts/lib/Array';
import {createTime, extractTime, isWithInIntervalExclusiveEnd} from '@/tools/dateTime';
import {pipe} from 'fp-ts/lib/pipeable';
import {toNullable} from 'fp-ts/lib/Option';
import {partial} from '@/tools/partial';

export namespace SectorRepository {
  export const sectors =
    pipe(fromArray(
      [createTime(8, 0),
        createTime(8, 55),
        createTime(10, 0),
        createTime(10, 55),
        createTime(12, 10),
        createTime(13, 5),
        createTime(14, 10),
        createTime(15, 5),
        createTime(16, 0),
        createTime(16, 55),
        createTime(18, 0),
        createTime(18, 55),
        createTime(19, 50),
      ]),
      toNullable,
      (it) => it as NonEmptyArray<Date>,
      map((it) => {
        return {start: it, end: addMinutes(it, 45)};
      }));

  export const rests =
    pipe(
      fromArray(zip(sectors, tail(sectors))),
      toNullable,
      (it) => it as NonEmptyArray<[Interval, Interval]>,
      map((it) => {
        return {start: it[0].end, end: it[1].start};
      })
    );
}

export namespace SectorService {
  export function sectorIndexForTime(dateTime: Date) {
    return findIndex(partial(isWithInIntervalExclusiveEnd, extractTime(dateTime)))(SectorRepository.sectors);
  }

  export function restIndexForTime(dateTime: Date) {
    return findIndex(partial(isWithInIntervalExclusiveEnd, extractTime(dateTime)))(SectorRepository.rests);
  }

  export function restForTime(dateTime: Date) {
    return findFirst((x: Interval) => isWithInIntervalExclusiveEnd(extractTime(dateTime), x))(SectorRepository.rests);
  }
}
