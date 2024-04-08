console.log('validation util loader')
import { defineRule } from '@vee-validate';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;

defineRule('required', value => {
    if (!value || !value.length) return 'This field is required';
    return true;
});

defineRule('email', value => {
    if (!value || !value.length) return true;

    // Check if email
    if (!EMAIL_REGEX.test(value)) {
        return 'This field must be a valid email';
    }
    return true;
});

defineRule('phone', value => {
    if (!value || !value.length) return true;

    // Check if phone
    if (value.length !== 10) {
        return 'Phone No is invalid';
    }
    return true;
});

defineRule('requiredCheckbox', value => {
    if (!value) return 'This field is required';
    return true;
});
