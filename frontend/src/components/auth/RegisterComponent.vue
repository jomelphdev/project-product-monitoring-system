<template>
    <div class="container">
        <div class="row justify-content-center mt-5">
            <div class="col-lg-9 col-12">
                <router-link style="cursor:pointer; " to="/login"><i class="fas fa-angle-left right"></i> Back to Login</router-link>
            </div>
        </div>

        <div class="header mt-3 mt-md-5 mb-5 text-center">
            <h3 class="title">NPI Gauge Inventory System</h3>
        </div>

        <form @submit.prevent="onRegister" role="form">
            <div class="row justify-content-center" >
                <div class="col-lg-4 col-md-6 mx-0 mx-lg-5">
                    <h3 class="text-center subTitle">Account</h3>
                    <div class="mb-3">
                        <label for="name"><span class="text-muted">Name</span></label>
                        <input type="text" v-model="name" class="form-control" autofocus placeholder="Enter your name">
                        <small class="text-danger p-0 m-0" v-if="missingName && attemptSubmit">Name is required!</small>
                    </div>

                    <div class="mb-3">
                        <label for="username"><span class="text-muted">Username</span></label>
                        <input type="text" v-model="username" class="form-control" autofocus placeholder="Enter your username">
                        <small class="text-danger p-0 m-0" v-if="missingUsername && attemptSubmit">Username is required!</small>
                    </div>

                    <label for="password"><span class="text-muted">Password</span></label>
                    <div class="input-group mb-3">
                        <input type="password" class="form-control toggle-password" v-model="password" placeholder="Enter your new password">

                        <div class="input-group-append">
                            <div class="input-group-text" @click="togglePassword">
                                <span class="fas fa-eye toggle-eye"></span>
                            </div>
                        </div>
                        <small class="w-100 text-danger p-0 m-0" v-if="missingPassword && attemptSubmit">Password is required.</small>
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

                <div class="col-lg-4 col-md-6 mx-0 mx-lg-5 mt-4 mt-md-0">
                    <div class="text-center">
                        <h3 class="subTitle">Set Security Question</h3>
                        <p class="mt-5 mb-3">The security question can help you reset the password when you forget it</p>
                    </div>

                    <div class="form-group" v-show="toggle">
                        <label for="question" class="text-muted">Select a Question</label>
                        <select class="form-control" id="question" v-model="selectedQuestion">
                            <option selected disabled value="">Choose Security Question</option>
                            <option value="What is your father's middle name?">What is your father's middle name?</option>
                            <option value="What is your mother's middle name?">What is your mother's middle name?</option>
                            <option value="What is the name of your favorite restaurant?">What is the name of your favorite restaurant?</option>
                            <option value="What is the name of your pet?">What is the name of your pet?</option>
                            <option value="Who is your favorite artist?">Who is your favorite artist?</option>
                        </select>
                        <small class="text-danger p-0 m-0" v-if="missingSelectedQuestion && attemptSubmit">Security question is required!</small>
                    </div>

                    <div class="mb-3" v-show="!toggle">
                        <label for="question" class="text-muted">Customize a Question</label>
                        <input type="text" v-model="inputQuestion" class="form-control" placeholder="Enter Security question">
                        <small class="text-danger p-0 m-0" v-if="missingInputQuestion && attemptSubmit">Security question is required!</small>
                    </div>

                    <div class="text-center mt-4">
                        <p style="cursor:pointer;" class="text-primary" @click="toggle = !toggle" v-show="toggle">Customize your question</p>
                        <p style="cursor:pointer;" class="text-primary" @click="toggle = !toggle" v-show="!toggle">Choose security question</p>
                    </div>

                    <div style="margin-top: 1.9rem;">
                        <label for="answer"><span class="text-muted">Answer</span></label>
                        <input type="text" v-model="answer" class="form-control" autofocus placeholder="Enter your answer" >
                        <small class="text-danger p-0 m-0" v-if="missingAnswer && attemptSubmit">Answer is required!</small>
                    </div>

                    <div class="text-right mt-3 mb-3">
                        <ButtonSubmit label1="Creating an account..." label2="Register" :isLoadingModal="isLoadingModal"></ButtonSubmit>
                    </div>

                </div>            
            </div>
        </form>
    </div>

</template>

<script>
import ButtonSubmit from "../buttons/ButtonSubmitSuccess.vue";
// import VsToast from "@vuesimple/vs-toast";
// import { baseURL, sessionStorageAccessToken } from "../../globalFunction";
import { baseURL } from "../../globalFunction";
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
    components: {ButtonSubmit},
    data() {
        return {
            name: "",
            username: "",
            password: "",
            confirmPassword: "",
            selectedQuestion: "",
            inputQuestion: "",
            answer: "",

            toggle : true,
            attemptSubmit: false,
            isLoadingModal : false,
        }
    },
    computed: {
        //validation for registration
        missingName() {
            if (this.name.length == "") return true;
            return false;
        },
        missingUsername() {
            if (this.username.length == "") return true;
            return false;
        },
        missingConfirmPassword() {
            if (this.password !== this.confirmPassword) return true;
            return false;
        },
        missingPassword() {
            if (this.password.length == "") return true;
            return false;
        },
        missingPasswordLength() {
            if (this.password.length < 8) return true;
            return false;
        },
        missingPasswordLowercase() {
            if (this.password.search(/[a-z]/) < 0) return true;
            return false;
        },
        missingPasswordUppercase() {
            if (this.password.search(/[A-Z]/) < 0) return true;
            return false;
        },
        missingPasswordNumber() {
            if (this.password.search(/[0-9]/) < 0) return true;
            return false;
        },
        missingSpecialChars() {
            const regularExpression  = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
            if (!regularExpression.test(this.password)) return true
            return false;
        },
        missingAnswer() {
            if (this.answer.length == "") return true;
            return false;
        },
        missingInputQuestion() {
            if (this.inputQuestion.length == "") return true;
            return false;
        },
        missingSelectedQuestion() {
            if (this.selectedQuestion == "" || this.selectedQuestion == undefined) return true;
            return false;
        },
    },
    methods : {
        async onRegister() {
            this.attemptSubmit = true
            const validated = this.validateRegistration()

            if(validated) {
                this.isLoadingModal = true
                const data = {
                    "name" : this.name,
                    "username" : this.username,
                    "password" : this.password,
                    "question" : this.toggle ? this.selectedQuestion : this.inputQuestion,
                    "answer" : this.answer
                }

                try {
                    const response = await axios.post(`${baseURL}/register/`, data)

                    if(response.data.apiResult.code == 200) {
                        this.isLoadingModal = false
                        this.attemptSubmit = false,

                        Swal.fire({
                            title: '',
                            text: response.data.apiResult.message,
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
        validateRegistration() {
            const missingQuestion = this.toggle ? this.missingSelectedQuestion : this.missingInputQuestion
            if (!this.missingName && !this.missingUsername && !this.missingPassword && 
                !this.missingConfirmPassword && !this.missingAnswer && !missingQuestion &&
                !this.missingPasswordLength && !this.missingPasswordLowercase && !this.missingPasswordUppercase && 
                !this.missingPasswordNumber && !this.missingSpecialChars
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