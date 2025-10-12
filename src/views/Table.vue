<template>
    <v-container>
        <v-data-table-virtual
            :headers="headers"
            :items="virtualBoats"
            height="1155"
            item-value="date"
            fixed-header
            style="border: 1px solid rgba(0, 0, 0, 0.2);"
        ></v-data-table-virtual>
    </v-container>
</template>

<script>
import boats from "../assets/energy_data_updated.json"
export default {
    data() {
        return {
            headers: [
                {title: 'Дата', align: 'start', key: 'date'},
                {title: 'Субъект РФ', align: 'start', key: 'region'},
                {title: 'Час', align: 'start', key: 'hour'},
                {title: 'ГЭС', align: 'start', key: 'hydro'},
                {title: 'АЭС', align: 'start', key: 'nuclear'},
                {title: 'ТЭС', align: 'start', key: 'thermal'},
                {title: 'СЭС', align: 'start', key: 'solar'},
                {title: 'ВЭС', align: 'start', key: 'wind'},
                {title: 'Прочие ВИЭ', align: 'start', key: 'other_renewables'},
                {title: 'ГЭС (мин тех)', align: 'start', key: 'hydro_min'},
                {title: 'АЭС (мин тех)', align: 'start', key: 'nuclear_min'},
                {title: 'ТЭС (мин тех)', align: 'start', key: 'thermal_min'},
                {title: 'СЭС (мин тех)', align: 'start', key: 'solar_min'},
                {title: 'ВЭС (мин тех)', align: 'start', key: 'wind_min'},
                {title: 'Прочие ВИЭ (мин тех)', align: 'start', key: 'other_renewables_min'},
                {title: 'ГЭС (мин техн)', align: 'start', key: 'hydro_min_techn'},
                {title: 'АЭС (мин техн)', align: 'start', key: 'nuclear_min_techn'},
                {title: 'ТЭС (мин техн)', align: 'start', key: 'thermal_min_techn'},
                {title: 'СЭС (мин техн)', align: 'start', key: 'solar_min_techn'},
                {title: 'ВЭС (мин техн)', align: 'start', key: 'wind_min_techn'},
                {title: 'Прочие ВИЭ (мин техн)', align: 'start', key: 'other_renewables_min_techn'},
                {title: 'ГЭС (макс тех)', align: 'start', key: 'hydro_max'},
                {title: 'АЭС (макс тех)', align: 'start', key: 'nuclear_max'},
                {title: 'ТЭС (макс тех)', align: 'start', key: 'thermal_max'},
                {title: 'СЭС (макс тех)', align: 'start', key: 'solar_max'},
                {title: 'ВЭС (макс тех)', align: 'start', key: 'wind_max'},
                {title: 'Прочие ВИЭ (макс тех)', align: 'start', key: 'other_renewables_max'},
                {title: 'План потребления', align: 'start', key: 'plan_consumption'},
                {title: 'План экспорта', align: 'start', key: 'plan_export'},
                {title: 'План импорта', align: 'start', key: 'plan_import'},
                {title: 'Цена покупки', align: 'start', key: 'buy_price'},
                {title: 'Цена продажи', align: 'start', key: 'sell_price'},
                {title: 'Полный план', align: 'start', key: 'total_plan'},
            ],
            boats
        }
    },
    computed: {
        virtualBoats() {
            return [...Array(10000).keys()].map(i => {
                // клонируем объект из boats
                const boat = { ...this.boats[i % this.boats.length] }
                // модифицируем поле date для уникальности
                boat.date = `${boat.date} #${i}`
                return boat
            })
        }
    }
}
</script>