<template>
    <v-card class="pa-0">
        faq
        <!--        <v-card-title class="pa-0" primary-title>-->
        <!--            <v-container class="pa-3">-->
        <!--                <v-layout align-center row wrap>-->
        <!--                    <v-flex fill-height xs1>-->
        <!--                        <v-layout align-center justify-center>-->
        <!--                            <v-avatar :size="avatarSize()">-->
        <!--                                <v-icon class="white&#45;&#45;text blue" medium>event</v-icon>-->
        <!--                            </v-avatar>-->
        <!--                        </v-layout>-->
        <!--                    </v-flex>-->
        <!--                    <v-divider class="mx-3" inset vertical>-->
        <!--                    </v-divider>-->
        <!--                    <v-flex xs9>-->
        <!--                        <v-layout row wrap>-->
        <!--                            <v-flex xs12>-->
        <!--                                今天是{{format(now,"yyyy年MM月dd日")}} 周{{dayNumberToChinese(now.getDay()).toNullable()}}-->
        <!--                            </v-flex>-->
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

    @Component
    export default class DateInfo extends Vue {
        private mounted() {
            const semesterStore = getModule(SemesterModule, this.$store);
            semesterStore.fetch();
            // .then(() => console.log(semesterStore.getByDateTime(addDays(new Date(), 30))));
        }
    };
</script>

<style scoped>

</style>
