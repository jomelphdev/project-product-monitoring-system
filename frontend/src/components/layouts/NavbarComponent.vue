<template>
  <div>
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <!-- Left navbar links -->
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
    
        <li class="nav-item">
          <a class="nav-link" data-widget="fullscreen" href="#" role="button">
            <i class="fas fa-expand-arrows-alt"></i>
          </a>
        </li>

        <li class="nav-item dropdown">
            <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
              <i class="far fa-user"></i>
            </a>
              
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                <a @click="getProfile" class="dropdown-item cursor-pointer" data-toggle="modal" data-target="#updateProfileModal">
                  <i class="fas fa-pencil-alt"></i>
                  Update Profile
                </a>

                <a class="dropdown-item mt-2 mb-3 cursor-pointer" data-toggle="modal" data-target="#changePasswordModal">
                  <i class="fas fa-lock"></i>
                  Change Password
                </a>

                <div class="dropdown-divider"></div>

                <a @click="onLogout" class="dropdown-item cursor-pointer">
                    <i class="fas fa-power-off"></i>
                    Logout
                </a>
            </div>
        </li>

      </ul>
    </nav>
    <!-- /.navbar -->
  
    <ProfileComponent :isLoading="isLoading" :profile="profile"/>
    
    <!-- system will auto logout when the session is expired  -->
    <AutoLogout />
  </div>
</template>

<script>
import AutoLogout from '../AutoLogoutComponent.vue';
import ProfileComponent from '../ProfileComponent.vue';
import { baseURL, headersAuthorization, sessionStorageAccessToken } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  components: {AutoLogout, ProfileComponent},
  data: () => ({
    profile: {},
    isLoading : false,
  }),
  mounted() {
  },
  methods: {
    onLogout() {
      sessionStorage.clear();
      this.$router.push('/login')
      location.reload()
    },
    async getProfile() {
      this.isLoading = true
      try {
          const headers = headersAuthorization()
          const response = await axios.get(`${baseURL}/profile/`, { headers } )
          if(response.data.apiResult.code == 200) {
              sessionStorageAccessToken(response.data.tokenInfo.access_token)
              this.isLoading = false
              this.profile = response.data.apiResult.payload
          }
      } catch (error) {
          Swal.fire({
              title: 'Something went wrong',
              text: 'Please try again later or contact Administrator!',
              icon: 'error',
              confirmButtonColor: "#6e7881",
          })
          this.isLoading = false
      }
    },
  }
}
</script>

<style scoped>
.navbar {
    padding: 0.7rem 0.5rem !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>