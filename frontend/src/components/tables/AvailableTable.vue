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
                    <td>{{ data.gauge_type }}</td>
                    <td>{{ data.size }}</td>
                    <td>{{ data.serial_num }}</td>
                    <td>
                        <div>
                            <button @click="onRequest(data)" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#openRequestModal">
                                Request
                            </button> 
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
    export default {
        name: 'AvailableTable',
        props: {
            tableHeaders: Array,
            tableData: Array,
        },
        methods: {
            onRequest(availableData) {
                const data = {
                    incoming_id : availableData.id,
                    size : availableData.size,
                    serial_num : availableData.serial_num,
                    gauge_type : availableData.gauge_type
                }
                this.$store.state.available.requestData = data
            },
        },
    }
</script>
  
  