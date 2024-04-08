export default `
<div class="m-5" v-loader="isLoading">
    <div class="text-center h3">Product</div>
    <router-link :to="'/products/edit/'+$route.params.id">Edit</router-link>    
    <p><span class="fw-bold">Name:</span> {{product.name}}</p>
    <p><span class="fw-bold">Category:</span> {{product.category}}</p>
    <p><span class="fw-bold">Description:</span> {{product.description}}</p>
    <p><span class="fw-bold">Amount:</span> {{formatCurrency(product.amount)}}</p>
    <p><span class="fw-bold">Tags:</span> {{product.tags}}</p>
</div>
`