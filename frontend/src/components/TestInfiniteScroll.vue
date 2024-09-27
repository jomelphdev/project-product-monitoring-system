<template>

    <div>
        <div style="display: flex; justify-content: center; margin-top: 50px;">
            <div>
                <h1>Vue JS Infinite Scroll</h1>
                <p>npm install vue-infinite-scroll</p>
            </div>
        </div>
        <div style="display: flex; justify-content: center;">
            <div class="scroll-container">
                <div class="container" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                <ul v-for="(item, i) in items" 
                    :key="item.id">
                    <li> {{ i+1 }} - {{ item.gauge_type }}</li>
                </ul>
                <div v-if="busy">Loading more items...</div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import infiniteScroll from 'vue-infinite-scroll';
  
  export default {
    directives: { infiniteScroll },
    data() {
      return {
        items: [],
        busy: false,
        page: 1,
        totalPages: null
      };
    },
    methods: {
      loadMore() {
        if (this.busy || this.page >= this.totalPages) return;
        
        this.page++;
        console.log(this.page);
        this.busy = true;
        axios.get(`http://localhost:8000/api/testInfiniteScroll?page=${this.page}`)
          .then(response => {
            const nextItem = response.data.apiResult.payload.data
            this.items.push(...nextItem);
            this.busy = false;
          })
          .catch(error => {
            console.log(error);
            this.busy = false;
          });
      }
    },
    mounted() {
      axios.get(`http://localhost:8000/api/testInfiniteScroll?page=1`)
        .then(response => {
          this.items = response.data.apiResult.payload.data;
          this.totalPages = Math.ceil(response.data.apiResult.payload.total / response.data.apiResult.payload.per_page);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  </script>
  
  <style>
.scroll-container {
  /* margin-top: 100px; */
  border: 1px solid #ccc;
  width: 80%;
  max-height: 400px; /* set a maximum height to enable scrolling */
  overflow-y: auto; /* enable vertical scrolling */
}

</style>