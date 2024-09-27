<template>
    <div>

    </div>
</template>

<script>
    import { secretPassphrase, expiresIn } from "../globalFunction";
    export default {
        data: () => ({
            events: ['click','mousemove','mousedown','scroll','keypress','load'],
            logoutTimer : null
        }),
        mounted() {
            this.events.forEach(function (event) {
                window.addEventListener(event, this.resetTimer)
            }, this);

            this.setTimers()
        },
        methods: {
            setTimers() {
                const getExpirationTime = sessionStorage.getItem(expiresIn)
                const expires_in = this.$CryptoJS.AES.decrypt(getExpirationTime, secretPassphrase).toString(this.$CryptoJS.enc.Utf8)
                this.logoutTimer = setTimeout(this.sessionExpired, expires_in * 1000)
            },
            sessionExpired() {
                sessionStorage.clear();
                this.$router.push('/login')
                location.reload()
            },
            resetTimer() {
                clearTimeout(this.logoutTimer)
                this.setTimers()
            },
        }
    }
</script>

<style scoped>

</style>