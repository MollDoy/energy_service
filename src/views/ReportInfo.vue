<template>
    <v-container>
        <v-row>
            <v-col 
            cols="3" 
            sm="6"
            lg="3"
            v-for="ri in reportInfo">
                <InfoCard>
                    <template v-slot:title>{{ ri.title }}</template>
                    <template v-slot:info1> {{ ri.info1 }}</template>
                    <template v-slot:info2> {{ ri.info2 }}</template>
                    <template v-slot:percentage>
                        <div 
                        class="text-caption" 
                        :class="ri.percentage.startsWith('-') ? 'text-error' : 'text-success'"
                        >
                            {{ ri.percentage }}
                        </div>
                    </template>
                </InfoCard>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card
                class="pa-4"
                elevation="1"
                rounded="lg"
                variant="outlined"
                style="border-color: rgba(0, 0, 0, 0.2)"
                >
                    <div class="text-h5 font-weight-bold" align="left">Динамика потребления</div>
                    <div class="text-body-2 text-grey-darken-1 mt-1" align="left">Потребление электроэнергии за 2024 год</div>
                    <div class="text-body-2 text-grey-darken-1 mt-6" align="left">Интерактивные графики</div>
                    <v-container class="d-flex">
                        <v-btn class="flex-grow-1 me-3" color="blue-grey-lighten-5" v-on:click="GraphType = 1"> По месяцам </v-btn>
                        <v-btn class="flex-grow-1 me-3" color="blue-grey-lighten-5" v-on:click="GraphType = 2"> По дням </v-btn>
                        <v-btn class="flex-grow-1 me-3" color="blue-grey-lighten-5" v-on:click="GraphType = 3"> По часам </v-btn>
                    </v-container>
                    <!-- Первый график -->
                    <v-container v-if="GraphType === 1">
                        <v-row>
                            <v-col>
                                <v-card
                                class="pa-4"
                                elevation="1"
                                rounded="lg"
                                variant="outlined"
                                style="border-color: rgba(0, 0, 0, 0.2); min-height: 500px"
                                >
                                    <div class="text-body-3 font-weight-bold mt-3" align="left">Плановое потребление по месяцам (МВт·ч)</div>
                                    <v-img :src="graph" class="mt-3" />
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card
                                class="pa-4"
                                elevation="1"
                                rounded="lg"
                                variant="outlined"
                                style="border-color: rgba(0, 0, 0, 0.2); min-height: 500px"
                                >
                                    <div class="text-body-3 font-weight-bold mt-3" align="left">Равновесные цены по месяцам (руб./МВт·ч)</div>
                                    <v-img :src="graph" class="mt-3" />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <!-- Второй график -->
                    <v-container v-if="GraphType === 2">
                        <v-card
                        class="pa-4"
                        elevation="1"
                        rounded="lg"
                        variant="outlined"
                        style="border-color: rgba(0, 0, 0, 0.2); min-height: 500px"
                        >
                            <div class="text-body-3 font-weight-bold mt-3" align="left">Ежедневная динамика цен (руб./МВт·ч)</div>
                            <v-img :src="graph2" max-height="620px" class="mt-3" cover />
                        </v-card>
                    </v-container>
                    <!-- Третий график -->
                    <v-container v-if="GraphType === 3">
                        <v-row>
                            <v-col>
                                <v-card
                                class="pa-4"
                                elevation="1"
                                rounded="lg"
                                variant="outlined"
                                style="border-color: rgba(0, 0, 0, 0.2); min-height: 500px"
                                >
                                    <div class="text-body-3 font-weight-bold mt-3" align="left">Почасовое потребление и цены</div>
                                    <v-img :src="graph" class="mt-3" />
                                </v-card>
                            </v-col>
                            <v-col>
                                <v-card
                                class="pa-4"
                                elevation="1"
                                rounded="lg"
                                variant="outlined"
                                style="border-color: rgba(0, 0, 0, 0.2); min-height: 500px"
                                >
                                    <div class="text-body-3 font-weight-bold mt-3" align="left">Почасовые объемы торговли</div>
                                    <v-img :src="graph" class="mt-3" />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import InfoCard from "../components/InfoCard.vue"
import reportInfo from "../assets/reportInfo.json"
import graph from "../assets/graph.jpg"
import graph2 from "../assets/graph2.jpg"
export default {
    props: {
        reportId: {type: Number, required: true}
    },
    components: {InfoCard},
    data() {
        return {
            reportInfo,
            GraphType: 1,
            graph,
            graph2
        }
    }
}
</script>