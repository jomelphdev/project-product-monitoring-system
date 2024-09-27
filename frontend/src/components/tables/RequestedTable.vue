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
                    <td>{{ data.request_form_number }}</td>
                    <td>{{ data.gauge_type }}</td>
                    <td>{{ data.size }}</td>
                    <td>{{ data.location }}</td>
                    <td>{{ data.serial_num }}</td>
                    <td>{{ data.date_requested }}</td>
                    <td>{{ data.requested_by }}</td>
                    <td>
                        <div>
                            <button @click="onReturn(data)" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#openReturnModal">
                                Return
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
            onReturn(requestedData) {
                const data = {
                    request_id : requestedData.id
                }
                this.$store.state.requested.returnData = data
            },
        },
    }
</script>
  
  