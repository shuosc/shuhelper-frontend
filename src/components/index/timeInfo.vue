<template>
    <v-card class="pa-0">
        <v-card-text class="pa-0" primary-title>
            <v-row class="pa-3">
                <v-col class="d-flex justify-center align-center" cols="2" sm="1">
                    <v-avatar :size="this.avatarSize()">
                        <v-icon class="white--text orange" medium>mdi-clock</v-icon>
                    </v-avatar>
                </v-col>
                <v-divider class="mx-1" inset vertical></v-divider>
                <v-col class="d-flex align-center pt-0 pb-0" cols="9" sm="10">
                    <v-row>
                        <v-col class="pa-0" cols="12" md="6">
                            现在是{{format(dateTimeStore.now, "HH点mm分ss秒")}}
                        </v-col>
                        <v-col class="pa-0" cols="12" v-if="isNone(userStore.user)">
                            <v-btn @click="$router.push('/login')" block color="primary">需要登录</v-btn>
                        </v-col>
                        <v-col class="pt-0 pb-0" cols="12" v-else>
                            <v-row>
                                <v-col class="pa-0" cols="12" v-if="pipe(
                                                                    dateTimeStore.currentDateTimeInSemester,
                                                                    chain(DateTimeInSemesterService.getHoliday),
                                                                    isSome)">
                                    今天放假！
                                </v-col>
                                <v-col class="pa-0" cols="12" v-else-if="pipe(
                                                                    dateTimeStore.currentDateTimeInSemester,
                                                                    map(DateTimeInSemesterService.schoolDay),
                                                                    map((it) => it === 0 || it === 6),
                                                                    getOrElse(() => false))">
                                    今天周末！
                                </v-col>
                                <v-col class="pa-0" cols="12" v-else-if="this.pipe(
                                                                            dateTimeStore.currentDateTimeInSemester,
                                                                            this.map(DateTimeInSemesterService.isAfterLastSector),
                                                                            this.getOrElse(() => false))">
                                    已经很晚了，不去休息吗？
                                </v-col>
                                <template v-else-if="
                                    pipe(dateTimeStore.currentDateTimeInSemester,
                                        map(DateTimeInSemesterService.isBeforeFirstSector),
                                        getOrElse(() => false))">
                                    <template v-if="isBefore(createTime(7,0,0), extractTime(this.dateTimeStore.now))">
                                        <template v-if="pipe(nextClass, map((it) => it.begin_sector === 1), getOrElse(() => false))">
                                            <v-col class="pa-0" cols="12" sm="4">
                                                搞快点，起床了
                                            </v-col>
                                            <v-col class="pa-0" cols="12" sm="5">
                                                {{ pipe(nextClass,
                                                chain((it) => this.courseStore.getById(it.course_by_teacher_id)),
                                                map((it) => it.name),
                                                toNullable) }} 还有 {{ differenceInMinutes(createTime(8,0,0),
                                                extractTime(dateTimeStore.now)) }} 分钟 上课
                                            </v-col>
                                            <v-col class="pa-0" cols="12" sm="3">
                                                在 {{toNullable(nextClass).place}}
                                            </v-col>
                                        </template>
                                        <v-col class="pa-0" cols="12" v-else>今天没有早课，可以睡懒觉了！</v-col>
                                    </template>
                                    <v-col class="pa-0" cols="12" sm="4" v-else>时间还早，不再睡会？</v-col>
                                </template>
                                <template v-else-if="this.pipe(dateTimeStore.currentDateTimeInSemester,
                                                               this.chain(DateTimeInSemesterService.currentSector),
                                                               this.isSome)">
                                    <v-col class="pa-0 d-flex justify-start align-center" cols="2" sm="1">
                                        <v-progress-circular
                                                :size="30"
                                                :value="100-toNullable(currentSectorPassedPercentage)"
                                                :width="2"
                                                color="red">
                                            {{45 - Math.round(toNullable(minutesPassedFromThisSectorBegin))}}
                                        </v-progress-circular>
                                    </v-col>
                                    <v-col class="pa-0" cols="10" sm="11">
                                        <v-row class="pb-0 pt-0" v-if="this.isSome(currentClass)">
                                            <v-col class="pb-0 pt-0" cols="12" md="2" sm="3">你应该在上</v-col>
                                            <v-col class="pb-0 pt-0" cols="12" md="10" sm="9">
                                                {{toNullable(courseStore.getById(toNullable(currentClass).course_by_teacher_id)).name}}
                                            </v-col>
                                        </v-row>
                                        <v-col class="pa-0" cols="12" v-else>这节你好像没课😊</v-col>
                                    </v-col>
                                </template>
                                <template v-else-if="this.pipe(dateTimeStore.currentDateTimeInSemester,
                                                               this.map(DateTimeInSemesterService.currentRest),
                                                               this.isSome)">
                                    <v-col class="pa-0 d-flex justify-start align-center" cols="2" sm="1">
                                        <v-progress-circular
                                                :size="30"
                                                :value="100-toNullable(currentRestPassedPercentage)"
                                                :width="2"
                                                color="green">
                                            {{toNullable(restRestMinutes)}}
                                        </v-progress-circular>
                                    </v-col>
                                    <v-col class="pt-0 pb-0" cols="10" sm="11">
                                        <v-row>
                                            <v-col class="pa-0" cols="12">下节课还有 {{toNullable(restRestMinutes)}}
                                                分钟上课
                                            </v-col>
                                            <template v-if="isSome(nextClass)">
                                                <v-col class="pa-0" cols="12" md="3" sm="4">你下节课要上的是</v-col>
                                                <v-col class="pa-0" cols="12" md="9" sm="6">
                                                    {{toNullable(courseStore.getById(toNullable(nextClass).course_by_teacher_id)).name}}
                                                </v-col>
                                                <v-col class="pa-0" cols="12" md="9" sm="2">
                                                    在 {{toNullable(nextClass).place}}
                                                </v-col>
                                            </template>
                                            <v-col class="pa-0" cols="12" v-else>然而你下节课好像没课😊</v-col>
                                        </v-row>
                                    </v-col>
                                </template>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {avatarSize} from '@/tools/avatarSize';
  import {differenceInMinutes, format, getHours, isAfter, isBefore} from 'date-fns';
  import {getModule} from 'vuex-module-decorators';
  import UserModule from '@/store/user';
  import {chain, getOrElse, isNone, isSome, map, option, Option, toNullable} from 'fp-ts/lib/Option';
  import DateTimeModule from '@/store/dateTime';
  import {DateTimeInSemesterService} from '@/model/semester/dateTimeInSemester';
  import {pipe} from 'fp-ts/lib/pipeable';
  import CourseModule, {Class} from '@/store/course';
  import SemesterModule from '@/store/semester';
  import {Semester} from '@/model/semester/semester';
  import {sequenceT} from 'fp-ts/lib/Apply';
  import {ClassService} from '@/model/class';
  import {findFirst} from 'fp-ts/lib/Array';
  import {createTime, extractTime} from '@/tools/dateTime';
  import {SectorService} from '@/model/sector';
  import {toPercent} from '@/tools/toPercent';
  import {_, partial} from "@/tools/partial";

  @Component({
    methods: {
      format,
      avatarSize,
      isNone,
      isSome,
      map,
      chain,
      pipe,
      getOrElse,
      toNullable,
      createTime,
      extractTime,
      getHours,
      differenceInMinutes,
      isBefore,
      isAfter
    }
  })
  export default class DateInfo extends Vue {
    private dateTimeStore = getModule(DateTimeModule, this.$store);
    private semesterStore = getModule(SemesterModule, this.$store);
    private courseStore = getModule(CourseModule, this.$store);
    private userStore = getModule(UserModule, this.$store);
    private DateTimeInSemesterService = DateTimeInSemesterService;

    public async mounted() {
      await this.semesterStore.fetchByDateTime();
      let semester = this.semesterStore.getByDateTime(this.dateTimeStore.now);
      while (isNone(semester)) {
        semester = this.semesterStore.getByDateTime(this.dateTimeStore.now);
        await (new Promise((resolve) => setTimeout(resolve, 1000)));
      }
      await this.courseStore.fetchBySemester((toNullable(semester) as Semester).id);
    }

    get classes() {
      return pipe(
        this.dateTimeStore.currentDateTimeInSemester,
        map((dateTimeInSemester) => this.courseStore.getClassesByDateTimeInSemester(dateTimeInSemester))
      );
    }

    get currentClass(): Option<Class> {
      const classes = this.classes;
      return pipe(
        sequenceT(option)(classes, this.dateTimeStore.currentDateTimeInSemester),
        chain(([classArray, dateTime]) =>
          findFirst((classObject: Class) => ClassService.isOnDateTime(classObject, dateTime))(classArray))
      );
    }

    get nextClass(): Option<Class> {
      const restIndex = SectorService.restIndexForTime(this.dateTimeStore.now);
      const nextSectorIdx: number = pipe(
        restIndex,
        map((it: number) => it + 1),
        getOrElse(() => 0)
      );
      const isNextClass = partial(ClassService.isOnSector, _, nextSectorIdx);
      return pipe(this.dateTimeStore.currentDateTimeInSemester,
        map((dateTimeInSemester) => this.courseStore.getClassesByDateTimeInSemester(dateTimeInSemester)),
        chain((it) => findFirst(isNextClass)(it))
      );
    }

    get currentRest(): Option<Interval> {
      return chain(DateTimeInSemesterService.currentRest)(this.dateTimeStore.currentDateTimeInSemester);
    }

    get currentRestMinutes(): Option<number> {
      return map((it: Interval) => differenceInMinutes(it.end, it.start))(this.currentRest);
    }

    get currentRestPassedMinutes(): Option<number> {
      return map((it: Interval) => differenceInMinutes(extractTime(this.dateTimeStore.now), it.start))(this.currentRest);
    }

    get restRestMinutes(): Option<number> {
      return pipe(
        sequenceT(option)(this.currentRestMinutes, this.currentRestPassedMinutes),
        map(([currentRestMinutes, currentRestPassedMinutes]) => currentRestMinutes - currentRestPassedMinutes)
      );
    }

    get minutesPassedFromThisSectorBegin() {
      return pipe(
        this.dateTimeStore.currentDateTimeInSemester,
        chain(DateTimeInSemesterService.currentSector),
        map((it) => differenceInMinutes(extractTime(this.dateTimeStore.now), it.start))
      );
    }

    get currentSectorPassedPercentage() {
      const minutesPerClass = 45;
      return pipe(
        this.minutesPassedFromThisSectorBegin,
        map((it) => Math.round(it * 100 / minutesPerClass))
      );
    }

    get currentRestPassedPercentage(): Option<number> {
      return pipe(
        sequenceT(option)(this.currentRestPassedMinutes, this.currentRestMinutes),
        map(([restPassed, restTotal]) => toPercent(restPassed, restTotal))
      );
    }
  }
</script>

<style scoped>
    @media screen and (min-width: 750px) {
        .v-avatar i {
            font-size: 30px;
        }
    }
</style>
