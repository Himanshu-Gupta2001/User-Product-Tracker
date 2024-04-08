export default `
<div class="m-5 loader" v-loader="products.isLoading">
    <div class="products-heading">Product List</div>
    <div class="text-end my-2">
        <input v-model="search.name" class="me-2"/>
        <button type="button" class="btn btn-sm btn-primary" @click="goToAddProduct">Add Product</button>
    </div>
    <div class="position-relative">
        <div style="height: calc(100vh - 235px); overflow: auto;" :infinite-scroll-hasMore="products.hasMore"
            v-infinite-scroll="{ next: ()=> getProducts(true) }">
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Created On</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product, index in products.list">
                        <th scope="row">{{index+1}}</th>
                        <td><router-link :to="'/products/'+product._id">{{product.name}}</router-link></td>
                        <td>{{product.category}}</td>
                        <td>{{product.createdOn}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-center" v-if="products.isScrollLoading"
            style="position: absolute; width: 100%; bottom: 0; height: 50px;background-color: rgba(17, 17, 17, 0.473);">
            <div class="spinner-border" role="status">
                <span class="sr-only"></span>
            </div>
        </div>
    </div>
</div>
`