import * as statisticsService from '../services/statistics';
import * as adminService from '../services/admin';
import { message } from 'antd'
import { now } from '../utils/moment';

export default {

    namespace: 'addsale',

    state: {
        // 扫码获取鞋垫信息 (出库)
        Buyout: 1,
        saleTime: null,
        visible: false,
        FixingIdDetailForWeb: null,
        hasFixingIdDetailForWeb: false,
        FixingIdDetailForWebs: [],
        FixingIdDetailForWebCode: '',
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(async ({ pathname, query }) => {
                if (pathname.includes('addsale')) {

                    const result = await dispatch({ type: 'users/GetLocalStorage' })
                    if (!result) {
                        history.push('/login')
                    }

                    await dispatch({ type: 'home/GetHomeData' })

                    if (pathname === '/addsale') {
                        let { saleTime } = query
                        saleTime = saleTime || now.unix()
                        await dispatch({ type: 'save', payload: { saleTime } })
                    }

                }
            })
        },
    },

    effects: {
        // 增加销售记录
        *AddSaleStatistics({ payload: { companyId, priceId, fixingIds, saleTime, buyout } }, { call, put, select }) {
            const { JwtToken, userId } = yield select(state => state.users.userInfo)
            const { data: { ret, code } } = yield call(statisticsService.AddSaleStatistics, { 
              body: { 
                userId,
                companyId,
                priceId,
                fixingIds,
                saleTime,
                buyout
              },
              headers: {
                Authorization: JwtToken
              } 
            });
            
            if (ret === 1001) {
                yield message.success(code)
                yield put({
                    type: 'save',
                    payload: {
                        FixingIdDetailForWeb: null,
                        hasFixingIdDetailForWeb: false,
                        FixingIdDetailForWebs: [],
                        FixingIdDetailForWebCode: ''
                    }
                })
                return true
            }
            if (ret === 1002) {
                yield message.warning(code)
                yield put({
                    type: 'save',
                    payload: {
                        FixingIdDetailForWeb: null,
                        hasFixingIdDetailForWeb: false,
                        FixingIdDetailForWebs: [],
                        FixingIdDetailForWebCode: ''
                    }
                })
                return false
            }
          },
          // 扫码获取鞋垫信息（出库）
          *GetFixingIdDetailForWeb({ payload: { fixingId } }, { call, put, select }) {
            // const { FixingIdDetailForWeb } = yield select(state => state.addsale)
            const { JwtToken, userId } = yield select(state => state.users.userInfo)
            const { data: { data, ret, code } } = yield call(adminService.GetFixingIdDetailForWeb, { 
                body: { 
                    userId,
                    fixingId
                }, 
                headers: { 
                    Authorization: JwtToken 
                } 
            });
            if (ret === 1001) {
                yield put({ 
                    type: 'save', 
                    payload: {
                        visible: true,
                        FixingIdDetailForWeb: data
                    }
                })
                return data
            }
            if (ret === 1002) {
                yield message.warning(code)
                return false
            }
            
          },
    },

    reducers: {
        save(state, action) {
        return { ...state, ...action.payload };
        },
    },

};
