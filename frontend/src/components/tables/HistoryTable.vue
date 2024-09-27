<template>
    <div class="table-responsive">
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
                    <td>{{ data.serial_num }}</td>
                    <td>{{ data.location }}</td>
                    <td>{{ data.date_requested }}</td>
                    <td>{{ data.requested_by }}</td>
                    <td>{{ data.date_returned }}</td>
                    <td>{{ data.returned_by }}</td>
                    <td>
                        <div :class="textColor(data.req_condition)">{{ data.req_condition }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
    export default {
        name: 'HistoryTable',
        props: {
            tableHeaders: Array,
            tableData: Array,
        },
        computed: {
            textColor() {
                return (status) => {
                    return {
                        'text-primary': status == "Okay",
                        'text-success': status == "Worn Out",
                        'text-danger': status == "Missing",
                    }
                }
            }
        }
    }
</script>
  
  