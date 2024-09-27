<template>
    <div>
        <!-- update profile modal -->
        <div class="modal fade" id="updateProfileModal">
            <form @submit.prevent="updateProfile" role="form" class="updateProfileForm">
                <div class="modal-dialog">
                    <div v-show="isLoading" class="overlay" style="background-color: white !important">
                        <loading-spinner></loading-spinner>
                    </div>
                    
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Edit Profile</h4>
                            <button type="button" class="close" ref="refUpdateCloseBtn" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="form-group">
                                <label for="update_name">Name</label>
                                <input type="text" v-model="profile.name" class="form-control" placeholder="Enter your name">
                                <small class="text-danger p-0 m-0" v-if="missingUpdateName && attemptSubmit">Name is required!</small>
                            </div>

                            <div class="form-group">
                                <label for="update_username">Username</label>
                                <input type="text" v-model="profile.username" class="form-control" placeholder="Enter your username">
                                <small class="text-danger p-0 m-0" v-if="missingUpdateUsername && attemptSubmit">Username is required!</small>
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

        <!-- change password modal -->
        <div class="modal fade" id="changePasswordModal">
            <form @submit.prevent="changePassword" role="form" class="changePasswordForm">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Change Password</h4>
                            <button type="button" ref="refUpdateCloseBtn" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <label for="current_password"><span class="text-muted">Current Password</span></label>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control toggle-password" v-model="currentPassword" placeholder="Enter your new password">

                                <div class="input-group-append">
                                    <div class="input-group-text" @click="togglePassword">
                                        <span class="fas fa-eye toggle-eye"></span>
                                    </div>
                                </div>
                                <small class="w-100 text-danger p-0 m-0" v-if="missingCurrentPassword && attemptSubmit">Current password is required!</small>
                            </div>

                            <label for="new_password"><span class="text-muted">New Password</span></label>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control toggle-password" v-model="newPassword" placeholder="Enter your new password">

                                <div class="input-group-append">
                                    <div class="input-group-text" @click="togglePassword">
                                        <span class="fas fa-eye toggle-eye"></span>
                                    </div>
                                </div>
                                <small class="w-100 text-danger p-0 m-0" v-if="missingNewPassword && attemptSubmit">New Password is required.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordLength && attemptSubmit" >Password must be at least 8 characters.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordLowercase && attemptSubmit" >Password must contain at least one lower case letter.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordUppercase && attemptSubmit" >Password must contain at least one upper case letter.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordNumber && attemptSubmit" >Password must contain at least one digit.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingSpecialChars && attemptSubmit" >Password should contain atleast one special character.</small>
                            </div>

                            <label for="confirmpassword"><span class="text-muted">Confirm password</span></label>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control toggle-password" v-model="confirmPassword" placeholder="Confirm password">

                                <div class="input-group-append">
                                    <div class="input-group-text" @click="togglePassword">
                                    <span class="fas fa-eye toggle-eye"></span>
                                    </div>
                                </div>
                                <small class="w-100 text-danger p-0 m-0" v-if="missingConfirmPassword && attemptSubmit">New password and confirm password does not matched!</small>
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
    import ButtonSubmit from "./buttons/ButtonSubmitSuccess.vue";
    import VsToast from "@vuesimple/vs-toast";
    import { baseURL, headersAuthorization, sessionStorageAccessToken, openToastMessage } from "../globalFunction";
    import axios from 'axios'
    import Swal from 'sweetalert2'
    export default {
        components: {ButtonSubmit},
        props: {
            isLoading : Boolean,
            profile: Object
        },
        data() {
            return {
                attemptSubmit: false,
                isLoadingModal : false,
                currentPassword : "",
                newPassword : "",
                confirmPassword: "",
            }
        },
        computed: {
            //validation for update profile
            missingUpdateName() {
                if (this.profile.name == "" || this.profile.name == undefined) return true;
                return false;
            },
            missingUpdateUsername() {
                if (this.profile.username == "" || this.profile.username == undefined) return true;
                return false;
            },
            missingCurrentPassword() {
                if (this.currentPassword.length == 0) return true;
                return false;
            },
            missingNewPassword() {
                if (this.newPassword.length == 0) return true;
                return false;
            },
            missingConfirmPassword() {
                if (this.newPassword !== this.confirmPassword) return true;
                return false;
            },
            missingPasswordLength() {
                if (this.newPassword.length < 8) return true;
                return false;
            },
            missingPasswordLowercase() {
                if (this.newPassword.search(/[a-z]/) < 0) return true;
                return false;
            },
            missingPasswordUppercase() {
                if (this.newPassword.search(/[A-Z]/) < 0) return true;
                return false;
            },
            missingPasswordNumber() {
                if (this.newPassword.search(/[0-9]/) < 0) return true;
                return false;
            },
            missingSpecialChars() {
                const regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,100}$/;
                if (!regularExpression.test(this.newPassword)) return true
                return false;
            },
        },
        methods: {
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
            async updateProfile() {
                this.attemptSubmit = true
                const validated = this.validateUpdateProfile();

                if(validated) {
                    this.isLoadingModal = true
                    try {
                        const headers = headersAuthorization()
                        const response = await axios.put(`${baseURL}/profile`, this.profile, { headers } )

                        if(response.data.apiResult.code == 200) {
                            this.isLoadingModal = false
                            sessionStorageAccessToken(response.data.tokenInfo.access_token)
                            
                            this.attemptSubmit = false
                            this.$refs.refUpdateCloseBtn.click()

                            openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
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
            async changePassword() {
                this.attemptSubmit = true
                const validated = this.validateChangePassword();
                
                if(validated) {
                    this.isLoadingModal = true
                    try {
                        const data = {
                            "current_password" : this.currentPassword,
                            "new_password" : this.newPassword,
                        }
                        const headers = headersAuthorization()
                        const response = await axios.put(`${baseURL}/change-password`, data, { headers } )

                        if(response.data.apiResult.code == 200) {
                            this.isLoadingModal = false
                            sessionStorageAccessToken(response.data.tokenInfo.access_token)

                            this.currentPassword = ""
                            this.newPassword = ""
                            this.confirmPassword = ""
                            
                            this.attemptSubmit = false
                            this.$refs.refUpdateCloseBtn.click()

                            openToastMessage(VsToast, "top-right", "success", response.data.apiResult.message)
                        }
                    } catch (error) {
                        this.isLoadingModal = false
                        if(error?.response?.data?.apiResult?.code == 401) {
                            return Swal.fire({
                                title: '',
                                text: 'Current Password does not matched on our records!',
                                icon: 'error',
                                confirmButtonColor: "#6e7881",
                            })
                        }
                        console.log(error?.response?.data?.catchMessage ?? 'Something went wrong!');
                        Swal.fire({
                            title: 'Something went wrong',
                            text: error?.response?.data?.apiResult?.message ?? 'Please try again later or contact Administrator!',
                            icon: 'error',
                            confirmButtonColor: "#6e7881",
                        })
                    }
                }
                
            },
            validateUpdateProfile() {
                if (!this.missingUpdateName && !this.missingUpdateUsername) return true
                return false
            },
            validateChangePassword() {
                if (
                    !this.missingCurrentPassword && !this.missingNewPassword && !this.missingConfirmPassword &&
                    !this.missingPasswordLength && !this.missingPasswordLowercase && !this.missingPasswordUppercase && 
                    !this.missingPasswordNumber && !this.missingSpecialChars
                ) return true
                return false
            },
        },
        mounted() {

        },
    }
</script>

<style scoped>

</style>