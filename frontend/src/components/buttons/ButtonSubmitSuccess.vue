<template>
    <button
        :class="isLoadingModal ? 'btn btn-success' : 'btn btn-success'"
        :disabled="isLoadingModal"
    >
        <span v-show="isLoadingModal" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span v-show="isLoadingModal">{{ label1 }}</span> <span v-show="!isLoadingModal">{{ label2 }}</span>
    </button>
</template>
  
<script>
    export default {
        name: 'ButtonSubmit',
        props: {
            label1: String,
            label2: String,
            isLoadingModal: Boolean
        },
    }
</script>
  
  