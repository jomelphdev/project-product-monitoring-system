<template>
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <router-link to="/" class="brand-link navbar-light">
      <img
        src="images/nakayama.png"
        alt="Nakayama"
        class="logo"
      />
    </router-link>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3">
        <div class="image">
          <a href="#" class="d-block text-white">NPI - QA Head</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          <li style="font-weight:bold; font-size:0.75rem; color: rgba(255, 255, 255, 0.25);" class="nav-header">DELIVER</li>
          <li class="nav-item" @click="resetStorePagination" :style="isDisabled ? 'pointer-events: none' : ''">
            <router-link to="/incoming" class="nav-link" :class="currentRouteName == 'Incoming' ? 'navActive' : '' ">
              <i class="nav-icon fas fa-shipping-fast"></i>
              <p class="text">Incoming</p>
            </router-link>
          </li>
          <li style="font-weight:bold; font-size:0.75rem; color: rgba(255, 255, 255, 0.25);" class="nav-header mt-3">REQUEST & RETURN</li>
          <li class="nav-item" @click="resetStorePagination" :style="isDisabled ? 'pointer-events: none' : ''">
            <router-link to="/available" class="nav-link" :class="currentRouteName == 'Available' ? 'navActive' : '' ">
              <i class="nav-icon far fa-circle text-info"></i>
              <p>Available Gauge</p>
            </router-link>
          </li>
          <li class="nav-item" @click="resetStorePagination" :style="isDisabled ? 'pointer-events: none' : ''">
            <router-link to="/requested" class="nav-link" :class="currentRouteName == 'Requested' ? 'navActive' : '' ">
              <i class="nav-icon far fa-circle text-success"></i>
              <p>Requested Gauge</p>
            </router-link>
          </li>
          <li style="font-weight:bold; font-size:0.75rem; color: rgba(255, 255, 255, 0.25);" class="nav-header mt-3">REPORTS</li>
          <li class="nav-item" @click="resetStorePagination" :style="isDisabled ? 'pointer-events: none' : ''">
            <router-link to="/history" class="nav-link" :class="currentRouteName == 'History' ? 'navActive' : '' ">
              <i class="nav-icon fas fa-history"></i>
              <p>History
              </p>
            </router-link>
          </li>
          <li class="nav-item" @click="resetStorePagination" :style="isDisabled ? 'pointer-events: none' : ''">
            <router-link to="/stocks" class="nav-link" :class="currentRouteName == 'Stocks' ? 'navActive' : '' ">
              <i class="nav-icon far fa-calendar-alt"></i>
              <p>Stocks</p>
            </router-link>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
export default {
  data() {
    return {
      // linkActive : 1
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name
    },
    // classIncoming() {
    //   return { navActive: this.linkActive == 1 }
    // },
    // classAvailable() {
    //   return { navActive: this.linkActive == 2 }
    // },
    // classRequested() {
    //   return { navActive: this.linkActive == 3 }
    // },
    // classHistory() {
    //   return { navActive: this.linkActive == 4 }
    // },
    // classStocks() {
    //   return { navActive: this.linkActive == 5 }
    // },
    isDisabled() {
      if(this.$store.state.globalStore.isDisabled) return true
      return false 
    }
  },
  methods : {
    // addNavActive(link) {
    //   if(link == 1) {
    //     this.linkActive = 1
    //   }
    //   else if(link == 2) {
    //     this.linkActive = 2
    //   }
    //   else if(link == 3) {
    //     this.linkActive = 3
    //   }
    //   else if(link == 4) {
    //     this.linkActive = 4
    //   }
    //   else if(link == 5) {
    //     this.linkActive = 5
    //   }
    // }

    resetStorePagination() {
      this.$store.state.pagination.pageNumber = 1
      this.$store.state.pagination.paginateValue = 10
      this.$store.state.pagination.searchItem = ''
      // console.log('reset');
    }
  }
}
</script>

<style scoped>
.navActive {
  background-color: #007bff !important;
  color: #fff !important;
}
.logo {
    width:230px; height:36px;
}
</style>