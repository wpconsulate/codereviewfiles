import request from '../utils/request';

// 添加聊天信息
export function AddChatData(options) {
    return request('/aberp_admin/AddChatData', {
        method: 'POST',
        ...options
    });
}

// 添加客户详情
export function AddCustomerData(options) {
    return request('/aberp_admin/AddCustomerData', {
        method: 'POST',
        ...options
    });
}

// 创建首条反馈信息
export function AddFeedBackData(options) {
    return request('/aberp_admin/AddFeedBackData', {
        method: 'POST',
        ...options
    });
}

// 创建一个公告
export function AddNotice(options) {
    return request('/aberp_admin/AddNotice', {
        method: 'POST',
        ...options
    });
}

// 批量导入公司
export function BatchUpdateCompany(options) {
    return request('/aberp_admin/BatchUpdateCompany', {
        method: 'POST',
        ...options
    });
}

// 批量导入规格
export function BatchUpdateSpec(options) {
    return request('/aberp_admin/BatchUpdateSpec', {
        method: 'POST',
        ...options
    });
}

// 删除客户
export function DelCustomerData(options) {
    return request('/aberp_admin/DelCustomerData', {
        method: 'POST',
        ...options
    });
}

// 删除反馈数据
export function DelFeedBackData(options) {
    return request('/aberp_admin/DelFeedBackData', {
        method: 'POST',
        ...options
    });
}

// 删除公告数据
export function DelNotice(options) {
    return request('/aberp_admin/DelNotice', {
        method: 'POST',
        ...options
    });
}

// 修改客户详情
export function EditCustomerData(options) {
    return request('/aberp_admin/EditCustomerData', {
        method: 'POST',
        ...options
    });
}

// 修改公告数据
export function EditNotice(options) {
    return request('/aberp_admin/EditNotice', {
        method: 'POST',
        ...options
    });
}

// 后台获取客户详情
export function GetCustomerData(options) {
    return request('/aberp_admin/GetCustomerData', {
        method: 'POST',
        ...options
    });
}

// 根据手机号码拿到客户信息
export function GetCustomerDataByPhone(options) {
    return request('/aberp_admin/GetCustomerDataByPhone', {
        method: 'POST',
        ...options
    });
}

// 后台获取客户列表 超级管理员可以获取全部
export function GetCustomerList(options) {
    return request('/aberp_admin/GetCustomerList', {
        method: 'POST',
        ...options
    });
}

// 后台获取反馈详情
export function GetFeedBackData(options) {
    return request('/aberp_admin/GetFeedBackData', {
        method: 'POST',
        ...options
    });
}

// 后台获取反馈列表 超级管理员可以获取全部
export function GetFeedBackList(options) {
    return request('/aberp_admin/GetFeedBackList', {
        method: 'POST',
        ...options
    });
}

// 扫码获取鞋垫信息
export function GetFixingIdDetailForSimpleForWeb(options) {
    return request('/aberp_admin/GetFixingIdDetailForSimpleForWeb', {
        method: 'POST',
        ...options
    });
}

// 扫码获取鞋垫信息
export function GetFixingIdDetailForWeb(options) {
    return request('/aberp_admin/GetFixingIdDetailForWeb', {
        method: 'POST',
        ...options
    });
}

// 后台获取设备列表 超级管理员可以获取全部
export function GetFixingList(options) {
    return request('/aberp_admin/GetFixingList', {
        method: 'POST',
        ...options
    });
}

// 获取商品列表
export function GetGoodsList(options) {
    return request('/aberp_admin/GetGoodsList', {
        method: 'POST',
        ...options
    });
}

// 获取商品规格
export function GetGoodsSpec(options) {
    return request('/aberp_admin/GetGoodsSpec', {
        method: 'POST',
        ...options
    });
}

// 获取首页数据
export function GetHomeData(options) {
    return request('/aberp_admin/GetHomeData', {
        method: 'POST',
        ...options
    });
}

// 获得公告列表
export function GetNoticeList(options) {
    return request('/aberp_admin/GetNoticeList', {
        method: 'POST',
        ...options
    });
}


// 修改反馈数据状态
export function SetFeedBackDataStatus(options) {
    return request('/aberp_admin/SetFeedBackDataStatus', {
        method: 'POST',
        ...options
    });
}
