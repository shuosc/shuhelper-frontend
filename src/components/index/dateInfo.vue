<template>
    <v-card class="pa-0">
        <v-card-text class="pa-0" primary-title>
            <v-row class="pa-3">
                <v-col class="d-flex justify-center align-center" cols="2" sm="1">
                    <v-avatar :size="this.avatarSize()">
                        <v-icon class="white--text blue" medium>mdi-calendar-check</v-icon>
                    </v-avatar>
                </v-col>
                <v-divider class="mx-1" inset vertical></v-divider>
                <v-col class="d-flex align-center pa-0" cols="9" sm="10">
                    <v-row>
                        <v-col class="pb-0 pt-0" cols="12" md="6">
                            今天是{{format(dateTimeStore.now, "yyyy年MM月dd日 E", {locale: zhCN})}}
                        </v-col>
                        <v-col class="pb-0 pt-0" cols="12" md="6"
                               v-if="this.isSome(dateTimeStore.currentDateTimeInSemester)">
                            是 {{toNullable(dateTimeStore.currentDateTimeInSemester).semester.name}}
                            <template
                                    v-if="DateTimeInSemesterService.getWorkWeekIndex(this.toNullable(dateTimeStore.currentDateTimeInSemester)) !== 0">
                                的第
                                {{DateTimeInSemesterService.getWorkWeekIndex(toNullable(dateTimeStore.currentDateTimeInSemester))}}
                                周
                            </template>
                        </v-col>
                        <v-col class="pb-0 pt-0" cols="12" md="6" v-if="this.pipe(
                                                    dateTimeStore.currentDateTimeInSemester,
                                                    this.chain(DateTimeInSemesterService.getHoliday),
                                                    this.isSome)">
                            现在正在放{{
                            this.pipe(
                            dateTimeStore.currentDateTimeInSemester,
                            this.chain(DateTimeInSemesterService.getHoliday),
                            toNullable
                            ).name
                            }}!
                        </v-col>
                        <v-col class="pb-0 pt-0" cols="12" v-else-if="this.isSome(nextHoliday)">
                            <template v-if="this.toNullable(daysToNextHoliday) !== 0">
                                距离下个假期 {{toNullable(nextHoliday).name}} 还有
                                {{toNullable(daysToNextHoliday)}} 天
                            </template>
                            <template v-else>下个假期 {{toNullable(nextHoliday).name}} 明天就开始！</template>
                        </v-col>
                        <v-col class="pb-1 pt-1" cols="12" v-if="this.isSome(finishedDaysPercentage)">
                            <v-progress-linear v-model="this.toNullable(finishedDaysPercentage)"></v-progress-linear>
                        </v-col>
                        <v-col class="pb-0 pt-0" cols="12" v-if="this.isSome(finishedDaysPercentage)">
                            已经过了 {{toNullable(totalWorkingDays)}} 个工作日中的 {{toNullable(finishedWorkingDays)}} 天
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {getModule} from "vuex-module-decorators";
  import SemesterModule from "@/store/semester";
  import {differenceInCalendarDays, format} from "date-fns";
  import {zhCN} from "date-fns/locale";
  import DateTimeModule from "@/store/dateTime";
  import {avatarSize} from "@/tools/avatarSize";
  import {chain, isSome, map, Option, option, some, toNullable} from "fp-ts/lib/Option";
  import {pipe} from "fp-ts/lib/pipeable";
  import {DateTimeInSemester, DateTimeInSemesterService} from "@/model/semester/dateTimeInSemester";
  import {sequenceT} from "fp-ts/lib/Apply";
  import {Holiday} from "@/model/semester/holiday/holiday";
  import {SemesterService} from "@/model/semester/semester";
  import {toPercent} from "@/tools/toPercent";

  @Component({
    methods: {
      format,
      avatarSize,
      isSome,
      toNullable,
      pipe,
      map,
      chain
    }
  })
  export default class DateInfo extends Vue {
    private readonly zhCN = zhCN;
    private dateTimeStore = getModule(DateTimeModule, this.$store);
    private semesterStore = getModule(SemesterModule, this.$store);
    private DateTimeInSemesterService = DateTimeInSemesterService;

    private mounted() {
      this.semesterStore.fetchByDateTime();
    }

    get nextHoliday(): Option<Holiday> {
      return pipe(
        this.dateTimeStore.currentDateTimeInSemester,
        chain(DateTimeInSemesterService.getNextHoliday)
      );
    }

    get daysToNextHoliday() {
      return pipe(
        sequenceT(option)(this.nextHoliday, some(this.dateTimeStore.now)),
        map(([nextHoliday, now]: [Interval, Date]) => differenceInCalendarDays(nextHoliday.start, now))
      );
    }

    get finishedWorkingDays(): Option<number> {
      return pipe(
        sequenceT(option)(
          this.dateTimeStore.currentDateTimeInSemester,
          map((it: DateTimeInSemester) => it.semester.start)(this.dateTimeStore.currentDateTimeInSemester),
          some(this.dateTimeStore.now)
        ),
        map(([dateTimeInSemester, from, to]) =>
          SemesterService.getWorkingDayCount(dateTimeInSemester.semester, from, to))
      );
    }

    get totalWorkingDays(): Option<number> {
      return pipe(
        this.dateTimeStore.currentDateTimeInSemester,
        map((it) => SemesterService.getTotalWorkingDayCount(it.semester))
      );
    }

    get finishedDaysPercentage(): Option<number> {
      return pipe(
        sequenceT(option)(this.finishedWorkingDays, this.totalWorkingDays),
        map(([finished, total]) => toPercent(finished, total))
      );
    }
  };
</script>

<style scoped>
    .v-card__text {
        font-size: 13px;
    }

    @media screen and (min-width: 370px) {
        .v-card__text {
            font-size: 15px;
        }
    }

    @media screen and (min-width: 750px) {
        .v-avatar i {
            font-size: 30px;
        }
    }
</style>
