import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import incomingModule from './modules/incoming.js'
import availableModule from './modules/available.js'
import requestedModule from './modules/requested.js'
import paginationModule from './modules/pagination.js'
import globalStore from './modules/globalStore.js'

const store = new Vuex.Store({
    modules: {
        incoming : incomingModule,
        available : availableModule,
        requested : requestedModule,
        pagination : paginationModule,
        globalStore : globalStore,
    }
})

export default store;