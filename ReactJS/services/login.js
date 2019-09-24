import request from '../utils/request';

export function LoginAccount(formData) {
    return request('/aberp_login/LoginAccount', {
        method: 'POST',
        body: formData
    });
}

export function SendForgetPasswordMessage(formData) {
    return request('/aberp_login/SendForgetPasswordMessage', {
        method: 'POST',
        body: formData
    });
}

export function UpdatePasswordForget(formData) {
    return request('/aberp_login/UpdatePasswordForget', {
        method: 'POST',
        body: formData
    });
}
