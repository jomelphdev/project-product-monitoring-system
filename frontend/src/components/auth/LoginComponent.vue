<template>
    <div class="container">
        <div class="header mt-5 text-center">
            <h3 class="title">NPI Gauge Inventory System </h3>
        </div>

        <div class="d-flex justify-content-center" >
            <div class="loginContent">
                <h3 class="text-center subTitle">Sign In</h3>
                <form class="loginForm" @submit.prevent="onLogin">
                    <div class="mb-3">
                        <label for="username"><span class="text-muted">Username</span></label>
                        <input type="text" v-model="username" id="username" name="username" class="form-control" autofocus placeholder="Enter your username">
                        <small class="text-danger p-0 m-0" v-if="missingUsername && attemptSubmit">Username is required!</small>
                    </div>

                    <label for="password"><span class="text-muted">Password</span></label>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control toggle-password" minlength="5" v-model="password" placeholder="Enter your password">

                        <div class="input-group-append">
                            <div class="input-group-text" @click="togglePassword">
                                <span class="fas fa-eye toggle-eye"></span>
                            </div>
                        </div>
                        <small class="w-100 text-danger p-0 m-0" v-if="missingPassword && attemptSubmit">Password is required!</small>
                    </div>

                    <!-- <button 
                        type="submit" 
                        :class="isLoadingModal ? 'btn btn-block mt-5 btn-primary' : 'btn btn-block btn-outline-primary mt-5'"
                        :disabled="isLoadingModal"
                    >
                        <span v-show="isLoadingModal" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span v-show="isLoadingModal">Signing in...</span> <span v-show="!isLoadingModal">Sign in</span>
                    </button> -->

                    <ButtonSubmit label1="Signing in..." label2="Sign in" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                </form>
                <div class="d-flex justify-content-end mt-1">
                    <router-link v-show="isUserExist == 1" style="cursor:pointer;" class="text-muted" to="/forgot-password">Forgot Password?</router-link>
                </div>
            </div>

            <img class="pinImage d-none d-md-block" src="images/pin-gauge.jpg" alt="">
        
        </div>

        <div class="d-flex justify-content-center mt-5">
            <router-link v-show="isUserExist == 2" style="cursor:pointer;" class="text-muted" to="/register">Don't have an account yet? <span class="text-primary">Sign Up</span></router-link>
        </div>
    </div>
</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitPrimaryDBlock.vue";
import { baseURL, sessionStorageAccessToken, secretPassphrase, expiresIn } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {ButtonSubmit},
    data() {
        return {
            username : "",
            password : "",
            isLoadingModal : false,
            attemptSubmit: false,
            isUserExist : 0,
            secretData : ""
        }
    },
    mounted() {
        this.getUserData()
    },
    computed: {
        // validation 
        missingUsername() {
            if (this.username == "" || this.username == undefined) return true;
            return false;
        },
        missingPassword() {
            if (this.password == "" || this.password == undefined) return true;
            return false;
        },
    },
    methods : {
        async getUserData() {
            try {
                const response = await axios.get(`${baseURL}/getUserData/`)
                if(response.data.apiResult.payload.length == 1) return this.isUserExist = 1
                return this.isUserExist = 2
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
        async onLogin() {
            this.attemptSubmit = true

            const data = {
                username : this.username,
                password : this.password
            }

            const validated = this.validateForm();
            if(validated) {
                this.isLoadingModal = true
                try {
                    const response = await axios.post(`${baseURL}/login/`, data)
                    if(response.data.apiResult.code == 200) {
                        this.isLoadingModal = false
                        sessionStorageAccessToken(response.data.tokenInfo.access_token)
                        this.secretData = response.data.tokenInfo.expires_in.toString()
                        const encryptedText = this.$CryptoJS.AES.encrypt(this.secretData, secretPassphrase).toString()
                        sessionStorage.setItem(expiresIn, encryptedText)
                        this.$router.push('/incoming')
                    }
                } catch (error) {
                    this.isLoadingModal = false
                    Swal.fire({
                        title: error.response.data.apiResult.message,
                        text: '',
                        icon: 'error',
                        confirmButtonColor: "#6e7881",
                    })
                }
            }
        },
        validateForm() {
            if (!this.missingUsername && !this.missingPassword) return true
            return false
        },
        togglePassword() {
            const icon = document.querySelectorAll(".toggle-eye");
            const password = document.querySelectorAll(".toggle-password");

            if (password[0].type === "password") {
                password.forEach((element) => {
                    element.setAttribute("type", "text");
                });

                icon.forEach((element) => {
                    element.classList.add("fa-eye-slash");
                });
            } else {
                password.forEach((element) => {
                    element.setAttribute("type", "password");
                });

                icon.forEach((element) => {
                    element.classList.remove("fa-eye-slash");
                });
            }
        },
    },
}
</script>

<style scoped>
.loginContent {
    margin-top:6rem;
}

.loginForm {
    width:300px;
}

.pinImage {
    width: 450px;
}

.title {
    font-family: 'Arial Nova Cond', sans-serif;
}

.subTitle {
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-weight: 600;
    letter-spacing: 3px;
}
</style>