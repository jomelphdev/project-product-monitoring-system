<template>
    <div class="row">
        <aside class="col-md-12 mt-3">
            <div class="card">
                <div v-if="isLoading" class="overlay">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>

                <div class="card-header">
                    <h3 class="card-title">List of Available Gauge</h3>
                </div>
                <div class="card-body pt-0 pb-3">
                    <FilterPagination :getListOfData="getAvailableGauge" :searchList="searchAvailableGauge"/>
                    
                    <div v-if="!hasRecords" class="text-center">
                        No records found
                    </div>
                    <div v-else>
                        <AvailableTable :tableHeaders="availableTableHeaders" :tableData="availableGaugeList" />
                    </div>
                        
                     <CustomPagination :pagination="pagination" :getListOfData="getAvailableGauge" />
                </div>

            </div>
        </aside>

        <!-- request modal -->
        <div class="modal fade" id="openRequestModal">
            <form @submit.prevent="makeRequest" role="form" class="requestForm">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Request a Gauge</h4>
                            <button type="button" class="close" ref="refAddCloseBtn" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">

                            <div class="form-group">
                                <label for="request_form_number">Request Form Number</label>
                                <input type="text" v-model="requestFormNumber" class="form-control" placeholder="Form Number">
                                <small class="text-danger p-0 m-0" v-if="missingRequestFormNumber && attemptSubmit">Request Form Number is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="requested_by">Requested By</label>
                                <input type="text" v-model="requestedBy" class="form-control" placeholder="Requested By">
                                <small class="text-danger p-0 m-0" v-if="missingRequestedBy && attemptSubmit">Requestor Name is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="location">Location</label>
                                <select v-model="location" class="form-control">
                                    <option selected disabled value="">Choose Location</option>
                                    <option value="Blank">Blank</option>
                                    <option value="Setter">Setter</option>
                                    <option value="Grinding">Grinding</option>
                                    <option value="MVI">MVI</option>
                                    <option value="QA">QA</option>
                                    <option value="Spool">Spool</option>
                                    <option value="Storage">Storage</option>
                                    <option value="JT66(L1)">JT66(L1)</option>
                                    <option value="JT66(L2)">JT66(L2)</option>
                                </select>
                                <small class="text-danger p-0 m-0" v-if="missingLocation && attemptSubmit">Location is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="date_requested">Date Request</label>
                                <input type="datetime-local" v-model="dateRequested" class="form-control">
                                <small class="text-danger p-0 m-0" v-if="missingDateRequested && attemptSubmit">Date Request is required!</small>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary closeBtn" data-dismiss="modal">Close</button>
                            <ButtonSubmit label1="Requesting..." label2="Request" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        
    </div>
</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitSuccess.vue";
import AvailableTable from '../tables/AvailableTable.vue'
import CustomPagination from '../PaginationComponent.vue'
import FilterPagination from '../FilterPaginationComponent.vue'
import VsToast from "@vuesimple/vs-toast";
import { baseURL, headersAuthorization, sessionStorageAccessToken, openToastMessage } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {ButtonSubmit, AvailableTable, CustomPagination, FilterPagination},
    data() {
        return {
            requestFormNumber : null,
            requestedBy : '',
            location : '',
            dateRequested : null,

            attemptSubmit: false,
            isLoading : false,
            isLoadingModal : false,

            hasRecords : true,
            availableGaugeList : [],
            availableTableHeaders : ["Gauge Type", "Size", "Serial No.", "Action"],

            pagination : {},
        }
    },
    computed: {
        missingRequestFormNumber() {
            if (this.requestFormNumber == "" || this.requestFormNumber == null || this.requestFormNumber == undefined) return true;
            return false;
        },
        missingRequestedBy() {
            if (this.requestedBy == "" || this.requestedBy == undefined) return true;
            return false;
        },
        missingLocation() {
            if (this.location == "" || this.location == undefined) return true;
            return false;
        },
        missingDateRequested() {
            if (this.dateRequested == "" || this.dateRequested == null || this.dateRequested == undefined) return true;
            return false;
        },
    },
    mounted() {
        this.getAvailableGauge()
    },
    methods : {
        async getAvailableGauge() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue

                const data = { paginate: paginateValue }
                const response = await axios.post(`${baseURL}/available-gauge?page=${pageNumber}`, data, { headers } )

                if(response.data.apiResult.payload.length == 0) {
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    if(response.data.apiResult.code == 200) {
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        this.hasRecords = true
                        this.availableGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination
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
        async searchAvailableGauge() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue
                const searchItem = this.$store.state.pagination.searchItem

                const data = { 
                    "paginate": paginateValue,
                    "searchItem" : searchItem
                }

                const response = await axios.post(`${baseURL}/search-available-gauge?page=${pageNumber}`, data, { headers } )
                
                if(response.data.apiResult.payload.length == 0) {
                    this.availableGaugeList = []
                    this.pagination = {}
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    if(response.data.apiResult.code == 200) {
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        this.hasRecords = true
                        this.availableGaugeList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination
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
        async makeRequest() {
            this.attemptSubmit = true
            const validated = this.validateEmptyFields();

            const data = {
                incoming_id : this.$store.state.available.requestData.incoming_id,
                size : this.$store.state.available.requestData.size,
                serial_num : this.$store.state.available.requestData.serial_num,
                gauge_type : this.$store.state.available.requestData.gauge_type,
                request_form_number : this.requestFormNumber,
                requested_by : this.requestedBy,
                location : this.location,
                date_requested : this.dateRequested
            }
            if(validated) {
                this.isLoadingModal = true
                try {
                    const headers = headersAuthorization()
                    const response = await axios.post(`${baseURL}/request-gauge/`, data, { headers } )

                    if(response.data.apiResult.code == 201) {
                        this.isLoadingModal = false
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        
                        this.attemptSubmit = false,
                        this.$refs.refAddCloseBtn.click()

                        //clear the form fields
                        this.requestFormNumber = null
                        this.requestedBy = ''
                        this.location = ''
                        this.dateRequested = null

                        openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                        this.getAvailableGauge()
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
            if (!this.missingRequestFormNumber && !this.missingRequestedBy && !this.missingLocation && !this.missingDateRequested) return true
            return false
        },
    },
}
</script>

<style scoped>
.data-table {
    grid-template-columns: repeat(3, 1fr);
}
</style>