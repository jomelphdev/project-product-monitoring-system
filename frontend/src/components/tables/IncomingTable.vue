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
                    <td>{{ data.slip_num }}</td>
                    <td>{{ data.date_received }}</td>
                    <td>{{ data.gauge_type }}</td>
                    <td>{{ data.maker }}</td>
                    <td>{{ data.size }}</td>
                    <td>{{ data.serial_num }}</td>
                    <td>
                        <div v-if="data.status == 1">
                            <span @click="onUpdate(data)" class="text-primary" data-toggle="modal" data-target="#openUpdateModal">
                                <i class="fas fa-pencil-alt mr-2"></i>
                            </span> | 
                            <span @click="onDelete(data)" class="text-danger"><i class="fas fa-trash ml-2"></i></span>
                        </div>

                        <div v-else-if="data.status == 2">
                            <span class="text-primary">Requested</span>
                        </div>

                        <div v-else-if="data.status == 3">
                            <span class="text-success">Worn Out</span>
                        </div>

                        <div v-else-if="data.status == 4">
                            <span class="text-danger">Missing</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
    export default {
        name: 'IncomingTable',
        props: {
            tableHeaders: Array,
            tableData: Array,
        },
        methods: {
            formatDate(date) {
                var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;

                return [year, month, day].join('-');
            },
            onUpdate(incomingData) {    
                const data = {
                    incoming_id : incomingData.id,
                    slip_num : incomingData.slip_num,
                    maker : incomingData.maker,
                    size : incomingData.size,
                    serial_num : incomingData.serial_num,
                    date_received : incomingData.date_received ? this.formatDate(incomingData.date_received) : null,
                    gauge_type : incomingData.gauge_type
                }
                this.$store.state.incoming.updateData = data
            },
            onDelete(incomingData) {
                // console.log(incomingData);
                this.$store.state.incoming.onDeleteID = incomingData.id
                this.$store.state.incoming.onDeleteGaugeType = incomingData.gauge_type
            }
        },
    }
</script>
  
  