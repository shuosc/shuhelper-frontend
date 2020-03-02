<template>
    <v-card class="login-card elevation-12">
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>登录</v-toolbar-title>
        </v-toolbar>
        <v-expand-transition>
            <v-alert class="failed" type="error" v-if="showLoginFailed">
                登录失败：请检查学生证号和密码
            </v-alert>
        </v-expand-transition>
        <v-card-text>
            <v-form>
                <v-text-field label="学生证号" name="login"
                              prepend-icon="mdi-account"
                              type="text" v-model="username"/>
                <v-text-field label="密码" name="password"
                              prepend-icon="mdi-lock"
                              type="password" v-model="password"/>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer/>
            <v-btn :disabled="this.disabled" @click="login" color="primary">登录</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {getModule} from "vuex-module-decorators";
  import UserModule from "@/store/user";

  @Component({})
  export default class Login extends Vue {
    private username = "";
    private password = "";
    private disabled = false;
    private showLoginFailed = false;

    public async login() {
      this.disabled = true;
      try {
        await getModule(UserModule, this.$store).login({username: this.username, password: this.password});
        this.disabled = false;
        await this.$router.push("/");
      } catch (e) {
        this.disabled = false;
        this.showLoginFailed = true;
        this.password = "";
        window.setTimeout(() => this.showLoginFailed = false, 3000);
      } finally {
        this.disabled = false;
      }
    }
  };
</script>

<style scoped>
    .login-card {
        z-index: 1;
        width: 400px;
    }

    @media screen and (max-width: 420px) {
        .login-card {
            width: 300px;
        }
    }

    .failed {
        border-radius: 0;
    }
</style>
