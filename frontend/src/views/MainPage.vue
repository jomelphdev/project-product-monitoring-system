<template>
    <div class="wrapper">
        <NavbarComponent />
        <SidebarComponent />

        <!-- Pages -->
        <div class="content-wrapper">
            <div class="content">
                <div class="container-fluid">
                    <router-view />
                </div>
            </div>
        </div>

        <FooterComponent />
    </div>    
</template>

<script>
import SidebarComponent from '@/components/layouts/SidebarComponent.vue'
import NavbarComponent from '@/components/layouts/NavbarComponent.vue'
import FooterComponent from '@/components/layouts/FooterComponent.vue'

export default {
    components: {
        SidebarComponent,
        NavbarComponent,
        FooterComponent,
    }
}
</script>