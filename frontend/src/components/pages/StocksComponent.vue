<template>
    <div class="row">
        <aside class="col-md-12 mt-3">
            <div class="card">
                <div v-if="isLoading" class="overlay">
                    <i class="fas fa-2x fa-sync-alt fa-spin"></i>
                </div>

                <div class="card-header">
                    <h3 class="card-title">List of Stocks</h3>
                </div>
                <div class="card-body pt-0 pb-3">
                    <FilterPagination :getListOfData="getStocks" :searchList="searchStocks"/>

                    <div v-if="!hasRecords" class="text-center">
                        No records found
                    </div>
                    <div v-else>
                        <StocksTable :tableHeaders="stocksTableHeaders" :tableData="stocksList" />
                    </div>

                    <CustomPagination :pagination="pagination" :getListOfData="getStocks" />
                </div>

            </div>
        </aside>
    </div>
</template>

<script>
import StocksTable from '../tables/StocksTable.vue'
import CustomPagination from '../PaginationComponent.vue'
import FilterPagination from '../FilterPaginationComponent.vue'
import { baseURL, headersAuthorization, sessionStorageAccessToken } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {StocksTable, CustomPagination, FilterPagination},
    data() {
        return {
            isLoading : false,
            
            hasRecords : true,
            stocksList : [],
            stocksTableHeaders : ["Size", "Gauge Type", "Quantity"],

            pagination : {},
        }
    },
    computed: {
        
    },
    methods : {
        async getStocks() {
            this.isLoading = true
            this.$store.state.globalStore.isDisabled = true // disabled the sidebar nav
            try {
                const headers = headersAuthorization()
                const pageNumber = this.$store.state.pagination.pageNumber
                const paginateValue = this.$store.state.pagination.paginateValue

                const data = { paginate: paginateValue }
                const response = await axios.post(`${baseURL}/stocks?page=${pageNumber}`, data, { headers } )

                if(response.data.apiResult.payload.length == 0) {
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    if(response.data.apiResult.code == 200) {
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        this.hasRecords = true
                        this.stocksList = response.data.apiResult.payload.data
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
        async searchStocks() {
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

                const response = await axios.post(`${baseURL}/search-stocks?page=${pageNumber}`, data, { headers } )

                // console.log(response.data.apiResult.payload.data);
                
                if(response.data.apiResult.payload.length == 0) {
                    this.stocksList = []
                    this.pagination = {}
                    this.isLoading = false
                    this.hasRecords = false
                    this.$store.state.globalStore.isDisabled = false // remove the disabled function in sidebar nav
                }
                else {
                    if(response.data.apiResult.code == 200) {
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        this.hasRecords = true
                        this.stocksList = response.data.apiResult.payload.data
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
    },
    mounted() {
        this.getStocks()
    },
}
</script>

<style scoped>
.data-table {
    grid-template-columns: repeat(3, 1fr);
}
</style>