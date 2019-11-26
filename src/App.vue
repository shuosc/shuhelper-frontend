<template>
    <component :is="layout">
        <router-view></router-view>
    </component>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        name: "App",
        data: () => ({}),
        computed: {
            layout() {
                return this.$route.meta.layout || "default";
            }
        }
    });
</script>

<style>
    /* fix safari's silly bug */
    .v-overlay {
        display: none !important;
    }
</style>
