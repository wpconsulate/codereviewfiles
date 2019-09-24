import request from '../utils/request';

export function AdminAddgoodsData(options) {
    return request('/aberp_goods/AdminAddgoodsData', {
        method: 'POST',
        ...options
    });
}

export function AdminGetGoodSpeclist(options) {
    return request('/aberp_goods/AdminGetGoodSpeclist', {
        method: 'POST',
        ...options
    });
}
