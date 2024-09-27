<template>
    <div>
        <div class="row justify-content-between align-items-center">
            <div class="col-sm-12 col-md-3">
                Showing {{ paginationFrom }} to {{ paginationTo }} of {{ paginationTotal }} entries
            </div>

            <div class="col-sm-12 col-md-9">
                <nav aria-label="Page navigation example" class="d-flex justify-content-md-end">
                    <div class="pagination">
                        <div class="page-item">
                            <button @click="goToPreviousPage" type="button" class="btn btn-link" :disabled="currentPage === 1">Previous</button>
                        </div>

                        <div v-if="Object.keys(pagination).length == 0" class="page-item">
                            <button type="button" class="btn btn-link">1</button>
                        </div>
                        <div v-else class="page-item">
                            <button v-for="(page, index) in visiblePageNumbers" :key="index" @click="goToPage(page)" type="button" class="btn btn-link" :class="{'active': currentPage === page, 'disabled': page === '...'}" :disabled="page == '...'">{{ page }}</button>
                        </div>
                        
                        <div class="page-item">
                            <button @click="goToNextPage" type="button" class="btn btn-link" :disabled="currentPage === totalPages || Object.keys(pagination).length == 0">Next</button>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        name: 'PaginationComponent',
        data() {
            return {
                hasData : true
            }
        },
        props: {
            pagination: Object,
            getListOfData: Function
        },
        computed : {
            currentPage: {
                get() { return this.$store.state.pagination.pageNumber },
                set(newValue) { this.$store.state.pagination.pageNumber = newValue }
            },
            totalPages() {
                return Math.ceil(this.pagination.total / this.pagination.per_page);
            },
            pages() {
                const pagesToShow = this.pagination.per_page;
                const pages = [];
                const startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
                const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);
                for (let page = startPage; page <= endPage; page++) {
                    pages.push(page);
                }
                return pages;
            },
            visiblePageNumbers() {
                const visiblePageNumbers = [];
                const limit = 4; // Maximum number of visible page numbers
                const halfLimit = Math.floor(limit / 2);
                const startPage = Math.max(1, this.currentPage - halfLimit);
                const endPage = Math.min(this.totalPages, startPage + limit - 1);

                // Always include the first page
                if (startPage > 1) {
                    visiblePageNumbers.push(1, '...');
                }

                // Add visible page numbers within the range
                for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
                    visiblePageNumbers.push(pageNumber);
                }

                // Always include the last page
                if (endPage < this.totalPages) {
                    visiblePageNumbers.push('...', this.totalPages);
                }

                return visiblePageNumbers;
            },
            paginationFrom() {
                return this.pagination.from ? this.pagination.from : 0
            },
            paginationTo() {
                return this.pagination.to ? this.pagination.to : 0
            },
            paginationTotal() {
                return this.pagination.total ? this.pagination.total : 0
            }
        },
        methods: {
            goToPage(page) {
                this.currentPage = page;
                this.$store.state.pagination.pageNumber = this.currentPage
                this.getListOfData()
            },
            goToPreviousPage() {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.$store.state.pagination.pageNumber = this.currentPage
                    this.getListOfData()
                }
            },
            goToNextPage() {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.$store.state.pagination.pageNumber = this.currentPage
                    this.getListOfData()
                }
            },
        },
        
    }
</script>
  
<style scoped>
.active {
    background: #007bff;
    color: white;
}
</style>