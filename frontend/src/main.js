import Vue from 'vue'
import App from './App.vue'
import router from './router.js';
import store from './store/index.js';

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import DataTable from "@andresouzaabreu/vue-data-table";
import "@andresouzaabreu/vue-data-table/dist/DataTable.css";
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VueCryptojs from 'vue-cryptojs'

Vue.component('loading-spinner', LoadingSpinner)
Vue.component("data-table", DataTable);
Vue.component('date-picker', DatePicker)
Vue.use(VueSweetalert2);
Vue.use(VueCryptojs)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
