<template>
    <v-app-bar>
        <v-row justify="center" align="center">
            <router-link to="/">
                <v-btn> Главная </v-btn>
            </router-link>
            <router-link to="reports">
                <v-btn> Отчёты </v-btn>
            </router-link>
            <router-link to="/">
                <v-btn> Графики </v-btn>
            </router-link>
            <router-link to="/">

            </router-link>
        </v-row>
    </v-app-bar>
</template>

<style scoped>
.router-link-active {
    color: rgb(6, 4, 119);
}
</style>