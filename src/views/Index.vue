<template>
    <div class="pa-4">
        <DateInfo class="mb-1"></DateInfo>
        <TimeInfo></TimeInfo>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import DateInfo from '@/components/index/dateInfo.vue';
    import TimeInfo from '@/components/index/timeInfo.vue';

    @Component({
        components: {TimeInfo, DateInfo}
    })
    export default class Index extends Vue {
    };
</script>

<style scoped>

</style>
