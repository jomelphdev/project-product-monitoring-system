<template>
    <div class="row">
        <aside class="col-md-12 mt-3">
            <div class="card ">
                <div v-if="isLoading" class="overlay">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>

                <div class="card-header">
                    <h3 class="card-title">List of Requested Gauge</h3>
                </div>
                <div class="card-body pt-0 pb-3">
                    <FilterPagination :getListOfData="getRequestedGauge" :searchList="searchRequestedGauge"/>

                    <div v-if="!hasRecords" class="text-center">
                        No records found
                    </div>
                    <div v-else>
                        <RequestedTable :tableHeaders="requestedTableHeaders" :tableData="requestedGaugeList" />
                    </div>

                    <CustomPagination :pagination="pagination" :getListOfData="getRequestedGauge" />
                </div>

            </div>
        </aside>

        <!-- return modal -->
        <div @submit.prevent="makeReturn" class="modal fade" id="openReturnModal">
            <form role="form" class="returnForm">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Return a Gauge</h4>
                            <button type="button" class="close" ref="refUpdateCloseBtn" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">

                            <div class="form-group">
                                <label for="returnedBy">Return By</label>
                                <input type="text" v-model="returnedBy" class="form-control" placeholder="Return By">
                                <small class="text-danger p-0 m-0" v-if="missingReturnBy && attemptSubmit">Returnee Name is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="condition">How's the Condition?</label>
                                <select v-model="condition" class="form-control">
                                    <option selected disabled value="">Choose a Condition?</option>
                                    <option value="1">OK</option>
                                    <option value="3">WORN OUT</option>
                                    <option value="4">MISSING</option>
                                </select>
                                <small class="text-danger p-0 m-0" v-if="missingCondition && attemptSubmit">Please select a condition!</small>
                            </div>

                            <div class="form-group">
                                <label for="dateReturned">Date Return</label>
                                <input type="datetime-local" v-model="dateReturned" class="form-control">
                                <small class="text-danger p-0 m-0" v-if="missingDateReturn && attemptSubmit">Date Return is required!</small>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary closeBtn" data-dismiss="modal">Close</button>
                            <ButtonSubmit label1="Returning..." label2="Return" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitSuccess.vue";
import RequestedTable from '../tables/RequestedTable.vue'
import CustomPagination from '../PaginationComponent.vue'
import FilterPagination from '../FilterPaginationComponent.vue'
import VsToast from "@vuesimple/vs-toast";
import { baseURL, headersAuthorization, sessionStorageAccessToken, openToastMessage } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {ButtonSubmit, RequestedTable, CustomPagination, FilterPagination},
    data() {
        return {
            returnedBy : '',
            condition : '',
            dateReturned : null,

            attemptSubmit: false,
            isLoading : false,
            isLoadingModal : false,

            hasRecords : true,
            requestedGaugeList : [],
            requestedTableHeaders : ["Request Form No.", "Gauge Type", "Size / Dimension", "Location", "Serial No.", "Date Requested", "Requested By", "Action"],

            pagination : {},
        }
    },
    computed: {
        missingReturnBy() {
            if (this.returnedBy == "" || this.returnedBy == null || this.returnedBy == undefined) return true;
            return false;
        },
        missingCondition() {
            if (this.condition == "" || this.condition == null || this.condition == undefined) return true;
            return false;
        },
        missingDateReturn() {
            if (this.dateReturned == "" || this.dateReturned == null || this.dateReturned == undefined) return true;
            return false;
        },
    },
    mounted() {
        this.getRequestedGauge()
    },
    methods : {
        formatDate(dateString) {
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
            return date.toLocaleDateString('en-US', options)
        },
        async getRequestedGauge() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue

                const data = { paginate: paginateValue }
                const response = await axios.post(`${baseURL}/requested-gauge?page=${pageNumber}`, data, { headers } )
                // console.log(response.data);
                if(response.data.apiResult.payload.length == 0) {
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.requestedGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.requestedGaugeList.filter(item => {
                            return item.date_requested = item.date_requested ? this.formatDate(item.date_requested) : null
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
        async searchRequestedGauge() {
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

                const response = await axios.post(`${baseURL}/search-requested-gauge?page=${pageNumber}`, data, { headers } )
                
                if(response.data.apiResult.payload.length == 0) {
                    this.requestedGaugeList = []
                    this.pagination = {}
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.requestedGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.requestedGaugeList.filter(item => {
                            return item.date_requested = item.date_requested ? this.formatDate(item.date_requested) : null
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
        async makeReturn() {
            this.attemptSubmit = true
            const validated = this.validateEmptyFields();

            const request_id = this.$store.state.requested.returnData.request_id
            const data = {
                returned_by : this.returnedBy,
                condition : this.condition,
                date_returned : this.dateReturned
            }

             if(validated) {
                this.isLoadingModal = true
                try {
                    const headers = headersAuthorization()
                    const response = await axios.put(`${baseURL}/return-gauge/${request_id}`, data, { headers } )

                    if(response.data.apiResult.code == 200) {
                        this.isLoadingModal = false
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        
                        this.attemptSubmit = false,
                        this.$refs.refUpdateCloseBtn.click()

                        //clear the form fields
                        this.returnedBy = ''
                        this.condition = ''
                        this.dateReturned = null

                        openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                        this.getRequestedGauge()
                    }
                } catch (error) {
                    console.log(error?.response?.data?.catchMessage ?? 'Something went wrong!');
                    this.isLoadingModal = false
                    Swal.fire({
                        title: 'Something went wrong',
                        text: error?.response?.data?.apiResult?.message ?? 'Please try again later or contact Administrator!',
                        icon: 'error',
                        confirmButtonColor: "#6e7881",
                    })
                }
            }
        },
        validateEmptyFields() {
            if (!this.missingReturnBy && !this.missingCondition && !this.missingDateReturn) return true
            return false
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
}
</script>

<style scoped>
.data-table {
    grid-template-columns: repeat(3, 1fr);
}
</style>