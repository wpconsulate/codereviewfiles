import request from '../utils/request';


// 增加销售记录
export function AddSaleStatistics(options) {
    return request('/aberp_statistics/AddSaleStatistics', {
        method: 'POST',
        ...options
    });
}

// 扫条形码获取鞋垫信息
export function GetFixingIdDetailForReturnGoodsForWeb(options) {
    return request('/aberp_statistics/GetFixingIdDetailForReturnGoodsForWeb', {
        method: 'POST',
        ...options
    });
}

// 获得商品列表
export function GetGoodsList(options) {
    return request('/aberp_statistics/GetGoodsList', {
        method: 'POST',
        ...options
    });
}

// 获得销售记录(当月)
export function GetSaleStatistics(options) {
    return request('/aberp_statistics/GetSaleStatistics', {
        method: 'POST',
        ...options
    });
}

// 获得查询日各个公司查询销售总数
export function GetSaleStatisticsForDay(options) {
    return request('/aberp_statistics/GetSaleStatisticsForDay', {
        method: 'POST',
        ...options
    });
}

// 获得查询月各个公司查询销售总数
export function GetSaleStatisticsForMonth(options) {
    return request('/aberp_statistics/GetSaleStatisticsForMonth', {
        method: 'POST',
        ...options
    });
}

// 获得公司指定日全部销售详情
export function GetSellDetailStatisticsForDay(options) {
    return request('/aberp_statistics/GetSellDetailStatisticsForDay', {
        method: 'POST',
        ...options
    });
}

// 获得公司每月全部销售详情
export function GetSellDetailStatisticsForMonth(options) {
    return request('/aberp_statistics/GetSellDetailStatisticsForMonth', {
        method: 'POST',
        ...options
    });
}

// 获得公司每月全部销售详情带买断查询
export function GetSellDetailStatisticsForMonthAndBuyout(options) {
    return request('/aberp_statistics/GetSellDetailStatisticsForMonthAndBuyout', {
        method: 'POST',
        ...options
    });
}

// 退货
export function ReturnGoods(options) {
    return request('/aberp_statistics/ReturnGoods', {
        method: 'POST',
        ...options
    });
}