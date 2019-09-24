
import * as statisticsService from '../services/statistics';
import { message } from 'antd'
import { now } from '../utils/moment';

export default {

    namespace: 'returngoods',

    state: {
        // 扫码获取鞋垫信息
        hasFixingIdDetailForReturnGoodsForWeb: false,
        FixingIdDetailForReturnGoodsForWeb: [],
        FixingIdDetailForReturnGoodsForWebCode: '',
        // 获得公司每月全部销售详情 (退货记录)
        year: 0,
        month: 0,
        hasSellDetailStatisticsForMonth: false, 
        SellDetailStatisticsForMonth: null,
        SellDetailStatisticsForMonthCode: '' ,
        // 退货
        returnTime: null,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(async ({ pathname, query }) => {
                if (pathname.includes('returngoods')) {
                    const result = await dispatch({ type: 'users/GetLocalStorage' })
                    if (!result) {
                        history.push('/login')
                    }

                    const HomeData = await dispatch({ type: 'home/GetHomeData' })

                    if (pathname === '/returngoods') {
                        let { returnTime } = query
                        returnTime = returnTime || now.unix()
                        await dispatch({ type: 'save', payload: { returnTime }})
                    }

                    if (pathname === '/returngoods/SellDetailStatisticsForMonth') {
                        let { companyId, year, month, goodsId, state } = query
                        companyId = companyId || HomeData.CompanyList[0].CompanyId
                        year = year || now.year()
                        month = month || now.month() + 1
                        goodsId = goodsId || -1
                        state = state || 2
                        await dispatch({ type: 'GetSellDetailStatisticsForMonth', payload: { companyId, year, month, goodsId, state }})
                    }
                }
            })
        },
    },

    effects: {
        // 扫码获取鞋垫信息
        *GetFixingIdDetailForReturnGoodsForWeb({ payload: { fixingId } }, { call, put, select }) {
            const { FixingIdDetailForReturnGoodsForWeb } = yield select(state => state.returngoods)
            const { JwtToken, userId } = yield select(state => state.users.userInfo)
            const { data: { data, ret, code } } = yield call(statisticsService.GetFixingIdDetailForReturnGoodsForWeb, { 
                body: { 
                    userId, 
                    fixingId,
                }, 
                headers: { 
                    Authorization: JwtToken 
                } 
            })
            if (ret === 1001) {
                yield put({ 
                    type: 'save', 
                    payload: { 
                        hasFixingIdDetailForReturnGoodsForWeb: true,
                        FixingIdDetailForReturnGoodsForWeb: [...FixingIdDetailForReturnGoodsForWeb, data],
                        FixingIdDetailForReturnGoodsForWebCode: '',
                    }
                });
                return true
            }
            if (ret === 1002) {
                yield message.warning(code)
                return false
            }
        },
        // 获得公司每月全部销售详情 （退货）state 1：已销售；2：已退回
        *GetSellDetailStatisticsForMonth({ payload: { companyId, year, month, goodsId, state } }, { call, put, select }) {
            const { JwtToken, userId } = yield select(state => state.users.userInfo)
            const { data } = yield call(statisticsService.GetSellDetailStatisticsForMonth, { 
                body: { 
                    userId, 
                    companyId,
                    year,
                    month,
                    goodsId,
                    state,
                }, 
                headers: { 
                    Authorization: JwtToken 
                } 
            })
            const { ret, code } = data
            if (ret === 1001) {
                yield put({ 
                    type: 'save', 
                    payload: { 
                        year,
                        month,
                        hasSellDetailStatisticsForMonth: true, 
                        SellDetailStatisticsForMonth: data,
                        SellDetailStatisticsForMonthCode: '' 
                    }
                });
                return data
            }
            if (ret === 1002) {
                yield put({ 
                    type: 'save', 
                    payload: { 
                    selectTime: null,
                        hasSellDetailStatisticsForMonth: false, 
                        SellDetailStatisticsForMonth: null, 
                        SellDetailStatisticsForMonthCode: code
                    } 
                });
                return false
            }
        },
        // 退货
        *ReturnGoods({ payload: { fixingIds, returnTime } }, { call, put, select }) {
            const { JwtToken, userId } = yield select(state => state.users.userInfo)
            const { data: { ret, code } } = yield call(statisticsService.ReturnGoods, { 
                body: { 
                    userId, 
                    fixingIds,
                    returnTime,
                }, 
                headers: { 
                    Authorization: JwtToken 
                } 
            })
            if (ret === 1001) {
                yield message.success(code)
                return true
            }
            if (ret === 1002) {
                yield message.warning(code)
                return true
            }
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },

};
