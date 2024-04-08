export default `
<div class="row justify-content-center m-4">
    <div class="col-sm-5">
        <h3 class="text-center">Login</h3>
        <form @submit="handleLogin">
            <div class="mt-2">
                <label for="registrationEmail" class="form-label">Email address</label>
                <v-field type="text" as='input' name='email' :rules="{required: true, email: true}"
                    :validateOnInput="true" class="form-control" id="registrationEmail" />
            </div>
            <small><error-message name="email" class="text-danger" /></small>

            <div class="mt-2">
                <label for="registrationPassword" class="form-label">Password</label>
                <v-field type="password" as='input' name='password' class="form-control" :rules="{required: true}"
                    :validateOnInput="true" id="registrationPassword" />
            </div>
            <small><error-message name="password" class="text-danger" /></small>

            <div class="mt-4 text-center">
                <button type="submit" class="btn btn-primary px-3" :disabled='isSubmitting'>Login</button>
            </div>
        </form>
    </div>
</div>
`