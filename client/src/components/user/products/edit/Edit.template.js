export default `
<div class="row justify-content-center m-4" v-loader="isLoading">
    <div class="col-sm-5">
        <h3 class="text-center">Edit Product</h3>
        <form @submit="handleAddProduct">
            <div class="mt-2">
                <label for="name" class="form-label">Name</label>
                <Field type="text" as='input' name='name' :rules="{required: true}" :validateOnInput="true"
                    class="form-control" id="name" />
            </div>
            <small>
                <ErrorMessage name="name" class="text-danger" />
            </small>

            <div class="mt-2">
                <label for="category" class="form-label">Category</label>
                <Field type="text" as='input' name='category' class="form-control" :rules="{required: true}"
                    :validateOnInput="true" id="category" />
            </div>
            <small>
                <ErrorMessage name="category" class="text-danger" />
            </small>

            <div class="mt-2">
                <label for="description" class="form-label">Description</label>
                <Field as='textarea' name='description' class="form-control resize-none" :rules="{required: true}"
                    :validateOnInput="true" id="description" />
            </div>
            <small>
                <ErrorMessage name="description" class="text-danger" />
            </small>

            <div class="mt-2">
                <label class="form-label">Amount</label>
                <Field v-slot="{ field }" name="amount">
                    <TheNumberInput v-bind="field" class="form-control resize-none" prefix="$ "
                        :minimumFractionDigits="2" :precision="2" :min="0" />
                </Field>
            </div>

            <div class="mt-2">
                <label class="form-label">Tags</label>
                <Field v-slot="{ field }" name="tags">
                    <VueformMultiselect mode="tags" v-bind="field" :searchable="true"
                        :options="[{label: 'Label 1', value: 'label1'}, {label: 'Label 2', value: 'label2'}, {label: 'Label 3', value: 'label3'}]" />
                </Field>
            </div>

            <div class="mt-4 text-center">
                <button type="submit" class="btn btn-primary px-3" :disabled='isSubmitting'>Update Product</button>
            </div>
        </form>
    </div>
</div>
`