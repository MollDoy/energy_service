<template>
    <v-container>
        <v-card class="pa4" >
            <v-card-text>
                <div class="text-h5 font-weight-bold" align="center">Динамика потребления</div>
                <v-img :src=graph alt="" max-height="500px" class="mt-1" />

                <div class="text-h5 font-weight-bold" align="center">Объёмы по генераторам: 2025-10-10 vs 2025-10-11</div>
                <v-img :src=graph2 alt="" max-height="500px" class="mt-1" />
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import graph from "../assets/home-graph.png"
import graph2 from "../assets/home-graph2.png"
export default {
    data() {
        return {
            graph,
            graph2
        }
    }
}
</script>