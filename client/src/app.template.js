export default `
<div v-loader="isLoading">
    <template v-if="store.user">
        <TheNavbar></TheNavbar>
    </template>
    <template v-else>
        <TheHeader></TheHeader>
    </template>
    <router-view></router-view>
</div>
`