<template>
    <v-card class="pa-0">
        <v-card-text class="pa-0" primary-title>
            <v-row class="pa-3">
                <v-col class="d-flex justify-center align-center" cols="1">
                    <v-avatar>
                        <v-icon class="white--text blue" medium>mdi-calendar-check</v-icon>
                    </v-avatar>
                </v-col>
                <v-divider class="mx-3" inset vertical></v-divider>
                <v-col cols="9">
                    <v-row>
                        <v-col cols="12">
                            今天是{{format(dateTimeStore.now, "yyyy年MM月dd日 E", {locale: zhCN})}}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-text>
        <!--                <v-layout align-center row wrap>-->
        <!--                    <v-flex xs9>-->
        <!--                        <v-layout row wrap>-->
        <!--                            <v-flex v-if="currentDateInSemester.isSome()" xs12>-->
        <!--                                是 {{currentDateInSemester.map(it => it.semester.name).toNullable()}}-->
        <!--                                <template v-if="currentDateInSemester.map(getWorkWeekIndex).getOrElse(0) !== 0">-->
        <!--                                    的第 {{currentDateInSemester.map(getWorkWeekIndex).toNullable()}} 周-->
        <!--                                </template>-->
        <!--                            </v-flex>-->
        <!--                            <v-flex v-if="currentDateInSemester.chain(getHoliday).isSome()" xs12>-->
        <!--                                现在正在放{{currentDateInSemester.chain(getHoliday).map(it => it.name).toNullable()}}!-->
        <!--                            </v-flex>-->
        <!--                            <v-flex v-else-if="nextHoliday.isSome()" xs12>-->
        <!--                                <template v-if="daysToNextHoliday.toNullable() !== 0">-->
        <!--                                    距离下个假期 {{nextHoliday.map(it => it.name).toNullable()}} 还有-->
        <!--                                    {{daysToNextHoliday.toNullable()}} 天-->
        <!--                                </template>-->
        <!--                                <template v-else>下个假期 {{nextHoliday.map(it => it.name).toNullable()}} 明天就开始！</template>-->
        <!--                            </v-flex>-->
        <!--                            <v-flex v-if="finishedDaysPercentage.isSome()" xs12>-->
        <!--                                <v-progress-linear v-model="finishedDaysPercentage.toNullable()"></v-progress-linear>-->
        <!--                            </v-flex>-->
        <!--                            <v-flex v-if="finishedDaysPercentage.isSome()" xs12>-->
        <!--                                已经过了 {{totalWorkingDays.toNullable()}} 个工作日中的 {{finishedWorkingDays.toNullable()}} 天-->
        <!--                            </v-flex>-->
        <!--                        </v-layout>-->
        <!--                    </v-flex>-->
        <!--                </v-layout>-->
        <!--            </v-container>-->
        <!--        </v-card-title>-->
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {getModule} from "vuex-module-decorators";
    import SemesterModule from "@/store/semester";
    import {format} from "date-fns";
    import {zhCN} from "date-fns/locale";
    import DateTimeModule from "@/store/dateTime";

    @Component({
        methods: {format}
    })
    export default class DateInfo extends Vue {
        private readonly zhCN = zhCN;
        private dateTimeStore = getModule(DateTimeModule, this.$store);
        private semesterStore = getModule(SemesterModule, this.$store);

        private mounted() {
            this.semesterStore.fetch();
        }
    };
</script>

<style scoped>
    .v-card__text {
        font-size: 1em;
    }
</style>
