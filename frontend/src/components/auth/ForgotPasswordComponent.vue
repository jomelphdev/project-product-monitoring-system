<template>
    <div class="container">
        <div class="mt-5 text-center">
            <h3 class="title">NPI Gauge Inventory System</h3>
        </div>

        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mt-5">
                    <div v-show="isLoading" class="overlay" style="background-color: white !important">
                        <loading-spinner></loading-spinner>
                    </div>
                    
                    <div class="card-header">
                        <h2 class="subTitle">Forgot Password</h2>
                    </div>

                    <div class="card-body">
                        <form @submit.prevent="checkForgotPassword" role="form">
                            <div class="mb-3">
                                <p class="text-center">{{ userData.question }}</p>
                                <input type="text" v-model="confirmAnswer" class="form-control" autofocus placeholder="Enter your answer">
                                <small class="text-danger p-0 m-0" v-if="missingAnswer && attemptSubmit">Answer is required!</small>
                            </div>

                            <button type="submit" class="btn btn-block btn-outline-primary mt-5">
                                Submit
                            </button>
                        </form>

                        <div class="d-flex justify-content-between mt-1">
                            <router-link style="cursor:pointer; font-size:12px;" class="text-muted" to="/login">login</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- forgot password modal -->
        <!-- the purpose of this button is to trigger open the Forgot Password Modal -->
        <button class="d-none" ref="openModal" data-toggle="modal" data-target="#forgotPasswordModal"></button>
        <div class="modal fade" id="forgotPasswordModal">
            <form @submit.prevent="forgotPassword" role="form">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Set Up New Password</h4>
                            <button type="button" ref="closeModal" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <label for="password"><span class="text-muted">Password</span></label>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control toggle-password" v-model="newPassword" placeholder="Enter your new password">

                                <div class="input-group-append">
                                    <div class="input-group-text" @click="togglePassword">
                                        <span class="fas fa-eye toggle-eye"></span>
                                    </div>
                                </div>
                                <small class="w-100 text-danger p-0 m-0" v-if="missingNewPassword && attemptSubmit">Password is required.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordLength && attemptSubmit" >Password must be at least 8 characters.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordLowercase && attemptSubmit" >Password must contain at least one lower case letter.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordUppercase && attemptSubmit" >Password must contain at least one upper case letter.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingPasswordNumber && attemptSubmit" >Password must contain at least one digit.</small>
                                <small class="w-100 text-danger p-0 m-0" v-else-if="missingSpecialChars && attemptSubmit" >Password should contain atleast one special character.</small>
                            </div>

                            <label for="password"><span class="text-muted">Confirm password</span></label>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control toggle-password" v-model="confirmPassword" placeholder="Confirm password">

                                <div class="input-group-append">
                                    <div class="input-group-text" @click="togglePassword">
                                    <span class="fas fa-eye toggle-eye"></span>
                                    </div>
                                </div>
                                <small class="w-100 text-danger p-0 m-0" v-if="missingConfirmPassword && attemptSubmit">Password does not matched!</small>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <ButtonSubmit label1=" Saving..." label2="Save" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>

</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitSuccess.vue";
import { baseURL } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'
export default {
    components : {ButtonSubmit},
    data() {
        return {
            isLoading : false,
            isLoadingModal : false,
            attemptSubmit : false,
            userData : {},
            confirmAnswer : '',
            newPassword : '',
            confirmPassword : '',
        }
    },
    computed : {
        missingAnswer() {
            if (this.confirmAnswer.length == "") return true;
            return false;
        },
        missingNewPassword() {
            if (this.newPassword.length == "") return true;
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
            const regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if (!regularExpression.test(this.newPassword)) return true
            return false;
        },
    },
    methods : {
        async getUserData() {
            this.isLoading = true
            try {
                const response = await axios.get(`${baseURL}/getUserData/`)
                if(response.data.apiResult.code == 200) {
                    this.userData = response.data.apiResult.payload[0]
                    this.isLoading = false
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
        checkForgotPassword() {
            this.attemptSubmit = true
            const validated = this.validateCheckForgotPassword()

            if(validated) {
                this.attemptSubmit = false
                if(this.userData.answer == this.confirmAnswer) {
                    this.$refs.openModal.click()
                }
                else {
                    Swal.fire({
                        title: '',
                        text: 'your answer did not matched on our records!',
                        icon: 'error',
                        confirmButtonColor: "#6e7881",
                    })
                }
            }
        },
        async forgotPassword() {
            this.attemptSubmit = true
            const validated = this.validateForgotPassword()

            if(validated) {
                this.isLoadingModal = true
                this.attemptSubmit = false
                try {
                    const data = {
                        "user_id" : this.userData.id,
                        "username" : this.userData.username,
                        "password" : this.newPassword
                    }
                    const response = await axios.put(`${baseURL}/forgot-password/`, data)
                    if(response.data.apiResult.code == 200) {
                        this.isLoadingModal = false
                        this.$refs.closeModal.click()
                        Swal.fire({
                            title: '',
                            text: 'Your password has been changed!',
                            icon: 'success',
                            allowOutsideClick: false
                        }).then((result) => {
                            if(result.value) {
                                this.$router.push('/login')
                            }
                        })
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
        validateCheckForgotPassword() {
            if (!this.missingAnswer) return true
            return false
        },
        validateForgotPassword() {
            if (
                !this.missingNewPassword && !this.missingConfirmPassword && !this.missingPasswordLength &&
                !this.missingPasswordLowercase && !this.missingPasswordUppercase && !this.missingPasswordNumber
                && !this.missingSpecialChars
            ) return true
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
    mounted() {
        this.getUserData()
    },
}
</script>

<style scoped>
.title {
    font-family: 'Arial Nova Cond', sans-serif;
}

.subTitle {
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-weight: 600;
    letter-spacing: 3px;
}
</style>