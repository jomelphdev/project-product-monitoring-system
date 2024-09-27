<template>
    <div>
        <div class="row justify-content-between align-items-center pb-4">
            <div class="col-xs-12 col-sm-6 mt-3">
                <div class="d-flex align-items-center">
                    <span>Show</span>
                    <div class="px-2">
                        <select class="form-control" @change="onChangePaginate($event)">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <span>entries</span>
                </div>
            </div>

            <div class="col-xs-12 col-sm-6 mt-3">
                <div class="d-flex align-items-center justify-content-sm-end">
                    <span>search:</span>
                    <div class="pl-2">
                        <input type="text" class="form-control" v-model="searchItem" @keyup.enter="searchIncoming">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                searchItem : ''
            }
        },
        name: 'FilterPaginationComponent',
        props: {
            getListOfData: Function,
            searchList: Function,
        },
        methods: {
            onChangePaginate(e) {
                this.$store.state.pagination.searchItem = ''
                this.searchItem = ''
                const pageNumber = 1
                const paginateValue = e.target.value
                this.$store.state.pagination.pageNumber = pageNumber
                this.$store.state.pagination.paginateValue = paginateValue
                this.getListOfData()
            },
            searchIncoming() {
                this.$store.state.pagination.searchItem = this.searchItem
                this.searchList()
            }
        },
        
    }
</script>
  
  