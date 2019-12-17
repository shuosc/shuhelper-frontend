import {Shift} from '@/model/semester/holiday/shift/shift';

export interface Holiday {
  readonly id: number;
  readonly start: Date;
  readonly end: Date;
  readonly name: string;
  readonly shifts: Array<Shift>;
}
