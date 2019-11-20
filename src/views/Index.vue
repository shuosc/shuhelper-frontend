<template>
    <DateInfo></DateInfo>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import DateInfo from "@/components/DateInfo.vue";

    @Component({
        components: {DateInfo}
    })
    export default class Index extends Vue {

    };
</script>

<style scoped>

</style>
