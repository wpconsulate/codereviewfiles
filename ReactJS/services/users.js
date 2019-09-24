import request from '../utils/request';

export function SendForgetPasswordMessage(formData, headers) {
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