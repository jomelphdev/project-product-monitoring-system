<template>
    <div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in tableData" :key="data.id">
                    <td>{{ data.size }}</td>
                    <td>{{ data.gauge_type }}</td>
                    <td>{{ data.qty }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
    export default {
        name: 'StocksTable',
        props: {
            tableHeaders: Array,
            tableData: Array,
        },
    }
</script>
  
  