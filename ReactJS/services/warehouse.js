import request from '../utils/request';

// 添加调货
export function AddAdjustment(options) {
    return request('/aberp_adjustment/AddAdjustment', {
        method: 'POST',
        ...options
    });
}

// 审批调货数据（必须超管）
export function ApprovalAdjustment(options) {
    return request('/aberp_adjustment/ApprovalAdjustment', {
        method: 'POST',
        ...options
    });
}

// 取消调货数据
export function CancelAdjustment(options) {
    return request('/aberp_adjustment/CancelAdjustment', {
        method: 'POST',
        ...options
    });
}

// 调货完成调货数据（必须超管）
export function FinishAdjustment(options) {
    return request('/aberp_adjustment/FinishAdjustment', {
        method: 'POST',
        ...options
    });
}

// 获取调货数据列表
export function GetAdjustmentList(options) {
    return request('/aberp_adjustment/GetAdjustmentList', {
        method: 'POST',
        ...options
    });
}

// 获取公司余额
export function GetCompanyBalance(options) {
    return request('/aberp_adjustment/GetCompanyBalance', {
        method: 'POST',
        ...options
    });
}

// 获取商品规格
export function GetGoodsSpec(options) {
    return request('/aberp_adjustment/GetGoodsSpec', {
        method: 'POST',
        ...options
    });
}

// 获得库存历史
export function GetStockHistory(options) {
    return request('/aberp_adjustment/GetStockHistory', {
        method: 'POST',
        ...options
    });
}

// 获得库存历史详情
export function GetStockHistoryDetail(options) {
    return request('/aberp_adjustment/GetStockHistoryDetail', {
        method: 'POST',
        ...options
    });
}

// 获得单个仓库详情
export function GetWarehouseDetail(options) {
    return request('/aberp_adjustment/GetWarehouseDetail', {
        method: 'POST',
        ...options
    });
}

// 获得仓库单个商品详情
export function GetWarehouseGoodsDetail(options) {
    return request('/aberp_adjustment/GetWarehouseGoodsDetail', {
        method: 'POST',
        ...options
    });
}

// 获得仓库总数列表
export function GetWarehouseSumList(options) {
    return request('/aberp_adjustment/GetWarehouseSumList', {
        method: 'POST',
        ...options
    });
}

// 搜索仓库总数列表（用户必须是超管）
export function SearchWarehouseSumList(options) {
    return request('/aberp_adjustment/SearchWarehouseSumList', {
        method: 'POST',
        ...options
    });
}