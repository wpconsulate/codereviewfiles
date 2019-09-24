import request from '../utils/request';

// 管理员修改公司余额
export function EditCompanyBalance(options) {
    return request('/aberp_balance/EditCompanyBalance', {
        method: 'POST',
        ...options
    });
}

// 获取公司余额操作列表
export function GetBalanceListForCompany(options) {
    return request('/aberp_balance/GetBalanceListForCompany', {
        method: 'POST',
        ...options
    });
}

// 管理员获得余额列表
export function GetBalanceListForVip(options) {
    return request('/aberp_balance/GetBalanceListForVip', {
        method: 'POST',
        ...options
    });
}

// 管理员获得充值代理商（公司）列表
export function GetCompanySimpleList(options) {
    return request('/aberp_balance/GetCompanySimpleList', {
        method: 'POST',
        ...options
    });
}
