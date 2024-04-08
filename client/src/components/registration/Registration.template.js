export default `
<div class="row justify-content-center m-4">
    <div class="col-sm-5">
        <h3 class="text-center">Registration</h3>
        <form @submit="handleRegistration">
            <div class="mt-2">
                <label for="registrationName" class="form-label">Name</label>
                <v-field type="text" as='input' name='name' class="form-control" :rules="{required: true}"
                    :validateOnInput="true" id="registrationName" />
            </div>
            <small><error-message name="name" class="text-danger" /></small>

            <div class="mt-2">
                <label for="registrationPhone" class="form-label">Phone No</label>
                <v-field type="text" as='input' name='phone' :rules="{required: true, phone: true}"
                    :validateOnInput="true" class="form-control" id="registrationPhone" />
            </div>
            <small><error-message name="phone" class="text-danger" /></small>

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

            <div class="mt-2">
                <v-field v-slot="{ field }" name="terms" type="checkbox" :value="true" :unchecked-value="false"
                    :rules="{requiredCheckbox: true}" :validateOnInput="true">
                    <label>
                        <input type="checkbox" name="terms" v-bind="field" :value="true" />
                        I agree
                    </label>
                </v-field> <br />
                <small><error-message name="terms" class="text-danger" /></small>
            </div>

            <div class="mt-2 text-center">
                <button type="submit" class="btn btn-primary px-3" :disabled='isSubmitting'>Signup</button>
            </div>
        </form>
    </div>
</div>
`