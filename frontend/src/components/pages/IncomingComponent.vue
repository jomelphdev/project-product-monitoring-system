<template>
    <div class="row">
        <aside class="col-md-12 mt-3">
            <div class="card">
                <div v-if="isLoading" class="overlay">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>

                <div class="card-header d-flex">
                    <div>
                        <h3 class="card-title">List of All Incoming Data</h3>
                    </div>
                    <div class="ml-auto">
                        <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#openAddModal">
                            <i class="fas fa-plus mr-1"></i>
                            <span>Incoming</span>
                        </button>
                    </div>
                </div>

                <div class="card-body pt-0 pb-3">
                    <FilterPagination :getListOfData="getIncoming" :searchList="searchIncoming"/>
                    
                    <div v-if="!hasRecords" class="text-center">
                        No records found
                    </div>
                    <div v-else>
                        <IncomingTable :tableHeaders="incomingTableHeaders" :tableData="incomingList" />
                    </div>
                        
                     <CustomPagination :pagination="pagination" :getListOfData="getIncoming" />
                </div>
            </div>
        </aside>

        <!-- add modal -->
        <div class="modal fade" id="openAddModal">
            <form @submit.prevent="addIncoming" role="form" class="addIncomingForm">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Add New Incoming</h4>
                            <button type="button" class="close" ref="refAddCloseBtn" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="form-group">
                                <label for="slip_num">Slip No.</label>
                                <!-- <input type="number" step="any" v-model="incoming.slipNum" class="form-control" placeholder="Enter slip number"> -->
                                <input type="text" v-model="incoming.slipNum" class="form-control" placeholder="Enter slip number">
                            </div>

                            <div class="form-group">
                                <label for="gauge_type">Gauge Type</label>
                                <select v-model="incoming.gaugeType" class="form-control">
                                    <option selected disabled value="">Choose Gauge Type</option>
                                    <option value="Pin Gauge">Pin Gauge</option>
                                    <option value="Thread Gauge">Thread Gauge</option>
                                    <option value="Master Gauge">Master Gauge</option>
                                    <option value="V-Bevel">V-Bevel</option>
                                </select>
                                <small class="text-danger p-0 m-0" v-if="missingAddGaugeType && attemptSubmit">Gauge Type is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="maker">Maker</label>
                                <input type="text" v-model="incoming.maker" class="form-control" placeholder="Maker">
                                <small class="text-danger p-0 m-0" v-if="missingAddMaker && attemptSubmit">Maker is required!</small>
                            </div>
                            <div class="form-group">
                                <label for="size">Size / Dimension</label>
                                <input type="number" step="any" v-model="incoming.size" class="form-control" placeholder="Size / Dimension">
                                <small class="text-danger p-0 m-0" v-if="missingAddSize && attemptSubmit">Dimension is required!</small>
                            </div>
                            <div class="form-group">
                                <label for="serial_num">Serial Number</label>
                                <!-- <input type="number" step="any" v-model="incoming.serialNum" class="form-control" placeholder="Serial Number"> -->
                                <input type="text" v-model="incoming.serialNum" class="form-control" placeholder="Serial Number">
                                <small class="text-danger p-0 m-0" v-if="missingAddSerialNum && attemptSubmit">Serial Number is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="date_received">Date Received</label>
                                <input type="date" v-model="incoming.dateReceived" class="form-control">
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary closeBtn" data-dismiss="modal">Close</button>
                            <ButtonSubmit label1="Saving..." label2="Add" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <!-- update modal -->
        <div class="modal fade" id="openUpdateModal">
            <form @submit.prevent="updateIncoming" role="form" class="updateIncomingForm">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Edit Record</h4>
                            <button type="button" class="close" ref="refUpdateCloseBtn" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">

                            <div class="form-group">
                                <label for="slip_num">Slip No.</label>
                                <!-- <input type="number" step="any" v-model="getSlipNum" class="form-control" placeholder="Enter slip number"> -->
                                <input type="text" v-model="getSlipNum" class="form-control" placeholder="Enter slip number">
                            </div>

                            <div class="form-group">
                                <label for="gauge_type">Gauge Type</label>
                                <select class="form-control" v-model="getGaugeType">
                                    <option selected disabled value="">Choose Gauge Type</option>
                                    <option value="Pin Gauge">Pin Gauge</option>
                                    <option value="Thread Gauge">Thread Gauge</option>
                                    <option value="Master Gauge">Master Gauge</option>
                                    <option value="V-Bevel">V-Bevel</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="maker">Maker</label>
                                <input type="text" v-model="getMaker" class="form-control" placeholder="Maker">
                                <small class="text-danger p-0 m-0" v-if="missingUpdateMaker && attemptSubmit">Maker is required!</small>
                            </div>
                            <div class="form-group">
                                <label for="size">Size / Dimension</label>
                                <input type="number" step="any" v-model="getSize" class="form-control" placeholder="Size / Dimension">
                                <small class="text-danger p-0 m-0" v-if="missingUpdateSize && attemptSubmit">Dimension is required!</small>
                            </div>
                            <div class="form-group">
                                <label for="serial_num">Serial Number</label>
                                <!-- <input type="number" step="any" v-model="getSerialNum" class="form-control" placeholder="Serial Number"> -->
                                <input type="text" v-model="getSerialNum" class="form-control" placeholder="Serial Number">
                                <small class="text-danger p-0 m-0" v-if="missingUpdateSerialNum && attemptSubmit">Serial Number is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="date_received">Date Received</label>
                                <input type="date" v-model="getDateReceived" class="form-control">
                            </div>
                        </div> 

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary closeBtn" data-dismiss="modal">Close</button>
                            <ButtonSubmit label1="Updating..." label2="Update" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitSuccess.vue";
import IncomingTable from '../tables/IncomingTable.vue'
import CustomPagination from '../PaginationComponent.vue'
import FilterPagination from '../FilterPaginationComponent.vue'
import VsToast from "@vuesimple/vs-toast";
import { baseURL, headersAuthorization, sessionStorageAccessToken, openToastMessage } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {ButtonSubmit, IncomingTable, CustomPagination, FilterPagination},
    data() {
        return {
            incoming : {
                slipNum : null,
                dateReceived : null,
                gaugeType : '',
                maker : '',
                size : null,
                serialNum : null
            },

            attemptSubmit: false,
            isLoading : false,
            isLoadingModal : false,

            hasRecords : true,
            incomingList : [],
            incomingTableHeaders : ["Slip No.", "Date Received", "Gauge Type", "Maker", "Size", "Serial No.", "Action"],

            pagination : {},
        }
    },
    watch: {
        // watch the computed to trigger the delete button when clicked
        onDeleteIncomingID(id) {
            if(id != '') {
                Swal.fire({
                    title: 'Confirm Delete!',
                    text: `Are you sure you want to delete this ${this.onDeleteGaugeType} ?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "Delete",
                    showLoaderOnConfirm: true,
                    backdrop: "rgba(0,0,0,0.4)",
                    preConfirm: () => {
                        return this.deleteIncoming(id)
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if(!result.isConfirmed) {
                        this.$store.state.incoming.onDeleteID = ''
                        this.$store.state.incoming.onDeleteGaugeType = ''
                    }
                })
            }
        }
    },
    computed: {
        onDeleteIncomingID() {
            return this.$store.state.incoming.onDeleteID
        },
        onDeleteGaugeType() {
            return this.$store.state.incoming.onDeleteGaugeType
        },

        //validation for add form
        missingAddGaugeType() {
            if (this.incoming.gaugeType == "" || this.incoming.gaugeType == undefined) return true;
            return false;
        },
        missingAddMaker() {
            if (this.incoming.maker == "" || this.incoming.maker == undefined) return true;
            return false;
        },
        missingAddSize() {
            if (this.incoming.size == "" || this.incoming.size == undefined) return true;
            return false;
        },
        missingAddSerialNum() {
            if (this.incoming.serialNum == "" || this.incoming.serialNum == undefined) return true;
            return false;
        },

        //validate for update form
        missingUpdateMaker() {
            if (this.$store.state.incoming.updateData.maker == "" || this.$store.state.incoming.updateData.maker == undefined) return true;
            return false;
        },
        missingUpdateSize() {
            if (this.$store.state.incoming.updateData.size == "" || this.$store.state.incoming.updateData.size == undefined) return true;
            return false;
        },
        missingUpdateSerialNum() {
            if (this.$store.state.incoming.updateData.serial_num == "" || this.$store.state.incoming.updateData.serial_num == undefined) return true;
            return false;
        },

        // get data from store for updating data
        getSlipNum: {
            get() { return this.$store.state.incoming.updateData.slip_num },
            set(newValue) { this.$store.state.incoming.updateData.slip_num = newValue }
        },
        getMaker: {
            get() { return this.$store.state.incoming.updateData.maker },
            set(newValue) { this.$store.state.incoming.updateData.maker = newValue }
        },
        getSize: {
            get() { return this.$store.state.incoming.updateData.size },
            set(newValue) { this.$store.state.incoming.updateData.size = newValue }
        },
        getSerialNum: {
            get() { return this.$store.state.incoming.updateData.serial_num },
            set(newValue) { this.$store.state.incoming.updateData.serial_num = newValue }
        },
        getDateReceived: {
            get() { return this.$store.state.incoming.updateData.date_received },
            set(newValue) { this.$store.state.incoming.updateData.date_received = newValue }
        },
        getGaugeType: {
            get() { return this.$store.state.incoming.updateData.gauge_type },
            set(newValue) { this.$store.state.incoming.updateData.gauge_type = newValue }
        },
    },
    methods : {
        formatDate(dateString) {
            const date = new Date(dateString)
            const options = { year: 'numeric', month: 'short', day: 'numeric' }
            return date.toLocaleDateString('en-US', options)
        },
        async getIncoming() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue

                const data = { paginate: paginateValue }
                const response = await axios.post(`${baseURL}/getIncomings?page=${pageNumber}`, data, { headers } )

                if(response.data.apiResult.payload.length == 0) {
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.incomingList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.incomingList.filter(item => {
                            return item.date_received = item.date_received ? this.formatDate(item.date_received) : null
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
        async searchIncoming() {
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

                const response = await axios.post(`${baseURL}/searchIncomings?page=${pageNumber}`, data, { headers } )
                
                if(response.data.apiResult.payload.length == 0) {
                    this.incomingList = []
                    this.pagination = {}
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)
                    this.hasRecords = true
                    if(response.data.apiResult.code == 200) {
                        this.incomingList = response.data.apiResult.payload.data
                        this.pagination = response.data.apiResult.payload.links.pagination

                        this.incomingList.filter(item => {
                            return item.date_received = item.date_received ? this.formatDate(item.date_received) : null
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
        async addIncoming() {
            this.attemptSubmit = true
            const validated = this.validateAddEmptyFields();

            const data = {
                slip_num : this.incoming.slipNum ? this.incoming.slipNum : '',
                date_received : this.incoming.dateReceived ? this.incoming.dateReceived : '',
                gauge_type : this.incoming.gaugeType,
                maker : this.incoming.maker,
                size : this.incoming.size,
                serial_num : this.incoming.serialNum,
            }

            if(validated) {
                this.isLoadingModal = true
                try {
                    const headers = headersAuthorization()
                    const response = await axios.post(`${baseURL}/incomings/`, data, { headers } )

                    if(response.data.apiResult.code == 201) {
                        this.isLoadingModal = false
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        
                        this.attemptSubmit = false,
                        this.$refs.refAddCloseBtn.click()

                        //clear the form fields
                        this.incoming.slipNum = null
                        this.incoming.dateReceived = null
                        this.incoming.gaugeType = ''
                        this.incoming.maker = ''
                        this.incoming.size = null
                        this.incoming.serialNum = null

                        openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                        this.getIncoming()
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
        async updateIncoming() {
            this.attemptSubmit = true
            const validated = this.validateUpdateEmptyFields();

            const data = {
                incoming_id : this.$store.state.incoming.updateData.incoming_id,
                slip_num : this.$store.state.incoming.updateData.slip_num ? this.$store.state.incoming.updateData.slip_num : '',
                maker : this.$store.state.incoming.updateData.maker,
                size : this.$store.state.incoming.updateData.size,
                serial_num : this.$store.state.incoming.updateData.serial_num,
                date_received : this.$store.state.incoming.updateData.date_received ? this.$store.state.incoming.updateData.date_received : '',
                gauge_type : this.$store.state.incoming.updateData.gauge_type,
            }
            
            if(validated) {
                this.isLoadingModal = true
                try {
                    const headers = headersAuthorization()
                    const response = await axios.put(`${baseURL}/incomings/${data.incoming_id}`, data, { headers } )

                    if(response.data.apiResult.code == 200) {
                        this.isLoadingModal = false
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        
                        this.attemptSubmit = false,
                        this.$refs.refUpdateCloseBtn.click()

                        //clear the form fields
                        this.incoming.slipNum = null
                        this.incoming.dateReceived = null
                        this.incoming.gaugeType = ''
                        this.incoming.maker = ''
                        this.incoming.size = null
                        this.incoming.serialNum = null

                        openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                        this.getIncoming()
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
        async deleteIncoming(id) {
            try {
                const headers = headersAuthorization()
                const response = await axios.delete(`${baseURL}/incomings/${id}`, { headers } )

                if(response.data.apiResult.code == 200) {
                    sessionStorageAccessToken(response.data.tokenInfo.access_token)

                    openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                    this.getIncoming()
                }
            } catch (error) {
                console.log(error?.response?.data?.catchMessage ?? 'Something went wrong!');
                Swal.fire({
                    title: 'Something went wrong',
                    text: error?.response?.data?.apiResult?.message ?? 'Please try again later or contact Administrator!',
                    icon: 'error',
                    confirmButtonColor: "#6e7881",
                })
                this.$store.state.incoming.onDeleteID = ''
                this.$store.state.incoming.onDeleteGaugeType = ''
            }
        },
        validateAddEmptyFields() {
            if (!this.missingAddGaugeType && !this.missingAddMaker && !this.missingAddSize && !this.missingAddSerialNum) return true
            return false
        },
        validateUpdateEmptyFields() {
            if (!this.missingUpdateMaker && !this.missingUpdateSize && !this.missingUpdateSerialNum) return true
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
    mounted() {
        this.getIncoming()
    },
    
}
</script>

<style scoped>
.data-table {
    grid-template-columns: repeat(3, 1fr);
}
</style>