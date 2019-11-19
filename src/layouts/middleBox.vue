<template>
    <div class="app">
        <flat-surface-shader :light="{ambient: '#22bc9e', diffuse: '#2b7c6b'}" class="shader"
                             type="webgl"/>
        <div class="mask"></div>
        <v-app>
            <v-content>
                <div class="fill-height d-flex flex-row justify-center align-center">
                    <slot></slot>
                </div>
            </v-content>
        </v-app>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class MiddleBox extends Vue {

    };
</script>

<style scoped>
    .mask,
    .shader {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
    }

    .shader {
        z-index: 0;
    }

    .mask {
        background: rgba(0, 0, 0, 0.6);
        z-index: 1;
    }
</style>
