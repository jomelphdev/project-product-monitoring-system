<template>
    <div class="row">
        <aside class="col-md-12 mt-3">
            <div class="card ">
                <div v-if="isLoading" class="overlay">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>

                <div class="card-header">
                    <h3 class="card-title">List of Requested and Returned Gauges</h3>
                </div>
                <div class="card-body pt-0 pb-3">
                    <FilterPagination :getListOfData="getReturnedGauge" :searchList="searchReturnedGauge"/>

                    <div v-if="!hasRecords" class="text-center">
                        No records found
                    </div>
                    <div v-else>
                        <HistoryTable :tableHeaders="historyTableHeaders" :tableData="returnedGaugeList" />
                    </div>

                    <CustomPagination :pagination="pagination" :getListOfData="getReturnedGauge" />
                </div>

            </div>
        </aside>
    </div>
</template>

<script>
import HistoryTable from '../tables/HistoryTable.vue'
import CustomPagination from '../PaginationComponent.vue'
import FilterPagination from '../FilterPaginationComponent.vue'
import { baseURL, headersAuthorization, sessionStorageAccessToken } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {HistoryTable, CustomPagination, FilterPagination},
    data() {
        return {
            isLoading : false,

            hasRecords : true,
            returnedGaugeList : [],
            historyTableHeaders : ["Request Form No.", "Gauge Type", "Size / Dimension", "Serial No.", "Location", "Date Requested", "Requested By", "Date Returned", "Returned By", "Condition"],

            pagination : {},
        }
    },
    computed: {
        
    },
    methods : {
        formatDate(dateString) {
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
            return date.toLocaleDateString('en-US', options)
        },
        async getReturnedGauge() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue

                const data = { paginate: paginateValue }
                const response = await axios.post(`${baseURL}/returned-gauge?page=${pageNumber}`, data, { headers } )

                if(response.data.apiResult.payload.length == 0) {
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.returnedGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.returnedGaugeList = this.returnedGaugeList.map(item => {
                            item.date_requested = item.date_requested ? this.formatDate(item.date_requested) : null
                            item.date_returned = item.date_returned ? this.formatDate(item.date_returned) : null
                            return item
                        })

                        this.isLoading = false
                        this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Something went wrong',
                    text: 'Please try again later or contact Administrator!',
                    icon: 'error',
                    confirmButtonColor: "#6e7881",
                })
                this.isLoading = false
                this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
            }
        },
        async searchReturnedGauge() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue
                const searchItem = this.$store.state.pagination.searchItem

                // Regular expression pattern to match month and day without year
                const pattern = /^(?:(?:January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|Sept|October|Oct|November|Nov|December|Dec)\s\d{1,2})$/i;
                const isMonthAndDayOnly = pattern.test(searchItem);

                const searchByMonth = this.getMonth(searchItem)

                let formattedDate = this.convertDate(searchItem)
                if (formattedDate == "NaN-NaN-NaN") {
                    formattedDate = 'invalid'
                } 

                let isMonthAndDayOnlyValue = ''
                if(isMonthAndDayOnly) {
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    isMonthAndDayOnlyValue = this.convertDate(searchItem+ ' ' +currentYear)
                }

                const data = { 
                    "paginate": paginateValue,
                    "searchByMonth" : searchByMonth,
                    "searchItem" : searchItem,
                    "searchByDate" : formattedDate,
                    "isMonthAndDayOnly" : isMonthAndDayOnly,
                    "isMonthAndDayOnlyValue" : isMonthAndDayOnlyValue
                }

                // console.log(data);

                const response = await axios.post(`${baseURL}/search-returned-gauge?page=${pageNumber}`, data, { headers } )
                
                if(response.data.apiResult.payload.length == 0) {
                    this.returnedGaugeList = []
                    this.pagination = {}
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.returnedGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.returnedGaugeList = this.returnedGaugeList.map(item => {
                            item.date_requested = item.date_requested ? this.formatDate(item.date_requested) : null
                            item.date_returned = item.date_returned ? this.formatDate(item.date_returned) : null
                            return item
                        })

                        this.isLoading = false
                        this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                    }
                }
            } catch (error) {
                Swal.fire({
                    title: 'Something went wrong',
                    text: 'Please try again later or contact Administrator!',
                    icon: 'error',
                    confirmButtonColor: "#6e7881",
                })
                this.isLoading = false
                this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
            }
        },
        convertDate(stringDate) {
            const originalDate = stringDate;
            const dateObject = new Date(originalDate);
            const year = dateObject.getFullYear();
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObject.getDate().toString().padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            return formattedDate
            // console.log(formattedDate); // Output: 2023-02-17
        },
        getMonth(searchItem) {
            let month = 0
            if(searchItem.toLowerCase() == "jan" || searchItem.toLowerCase() == "january") {
                month = 1
            }
            else if(searchItem.toLowerCase() == "feb" || searchItem.toLowerCase() == "february") {
                month = 2
            }
            else if(searchItem.toLowerCase() == "mar" || searchItem.toLowerCase() == "march") {
                month = 3
            }
            else if(searchItem.toLowerCase() == "apr" || searchItem.toLowerCase() == "april") {
                month = 4
            }
            else if(searchItem.toLowerCase() == "may") {
                month = 5
            }
            else if(searchItem.toLowerCase() == "jun" || searchItem.toLowerCase() == "june") {
                month = 6
            }
            else if(searchItem.toLowerCase() == "jul" || searchItem.toLowerCase() == "july") {
                month = 7
            }
            else if(searchItem.toLowerCase() == "aug" || searchItem.toLowerCase() == "august") {
                month = 8
            }
            else if(searchItem.toLowerCase() == "sep" || searchItem.toLowerCase() == "sept" || searchItem.toLowerCase() == "september") {
                month = 9
            }
            else if(searchItem.toLowerCase() == "oct" || searchItem.toLowerCase() == "october") {
                month = 10
            }
            else if(searchItem.toLowerCase() == "nov" || searchItem.toLowerCase() == "november") {
                month = 11
            }
            else if(searchItem.toLowerCase() == "dec" || searchItem.toLowerCase() == "december") {
                month = 12
            }
            return month
        }
    },
    mounted() {
        this.getReturnedGauge()
    },
}
</script>

<style scoped>
.data-table {
    grid-template-columns: repeat(3, 1fr);
}
</style>