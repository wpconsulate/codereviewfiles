import * as statisticsService from '../services/statistics';
import { now } from '../utils/moment';

export default {

    namespace: 'statistics',
  
    state: {
      // 获得商品列表
      goodsId: 0,
      hasGoodsList: false,
      GoodsList: null,
      GoodsListCode: '',
      // 获得销售记录(当月)
      year: 0,
      month: 0,
      day: 0,
      hasSaleStatistics: false,
      SaleStatistics: null,
      SaleStatisticsCode: '',
      // 获得公司指定日全部销售详情
      selectTime: null,
      hasSellDetailStatisticsForDay: false,
      SellDetailStatisticsForDay: null,
      SellDetailStatisticsForDayCode: '',
      // 获得公司每月全部销售详情
      buyout: '2',
      state: 1, 
      hasSellDetailStatisticsForMonth: false,
      SellDetailStatisticsForMonth: null,
      SellDetailStatisticsForMonthCode: '',
      // // 获得查询日各个公司查询销售总数
      hasSaleStatisticsForDay: false, 
      SaleStatisticsForDay: null,
      SaleStatisticsForDayCode: '',
      // 获得查询月各个公司查询销售总数
      hasSaleStatisticsForMonth: false, 
      SaleStatisticsForMonth: null,
      SaleStatisticsForMonthCode: '',
    },
  
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(async ({ pathname, query }) => {
              if (pathname.includes('statistics')) {

                const result = await dispatch({ type: 'users/GetLocalStorage' })
                if (!result) {
                  history.push('/login')
                }

                const HomeData = await dispatch({ type: 'home/GetHomeData' })

                const GoodsList = await dispatch({ type: 'GetGoodsList' })

                if (pathname === '/statistics') {
                  let { companyId, goodsId, year, month } = query
                  companyId = companyId || HomeData.CompanyList[0].CompanyId
                  goodsId = goodsId || GoodsList[0].GoodsId
                  year = year || now.year()
                  month = month || now.month() + 1
                  await dispatch({ type: 'GetSaleStatistics', payload: { companyId, goodsId, year, month } })
                }

                if (pathname === '/statistics/SaleStatisticsForDay') {
                  let { goodsId, selectTime } = query
                  goodsId = goodsId || GoodsList[0].GoodsId
                  await dispatch({ type: 'GetSaleStatisticsForDay', payload: { goodsId, selectTime  } })
                }

                if (pathname === '/statistics/SaleStatisticsForMonth') {
                  let { goodsId, year, month } = query
                  goodsId = goodsId || GoodsList[0].GoodsId
                  year = year || now.year()
                  month = month || now.month() + 1
                  await dispatch({ type: 'GetSaleStatisticsForMonth', payload: { goodsId, year, month  } })
                }

                if (pathname === '/statistics/SellDetailStatisticsForDay') {
                  let { goodsId, year, month, day } = query
                  goodsId = goodsId || GoodsList[0].GoodsId
                  year = year || now.year()
                  month = month || now.month() + 1
                  day = day || now.date()
                  await dispatch({ type: 'GetSellDetailStatisticsForDay', payload: { goodsId, year, month, day } })
                }

                if (pathname === '/statistics/SellDetailStatisticsForMonth') {
                  let { companyId, year, month, goodsId, state } = query
                  companyId = companyId || HomeData.CompanyList[0].CompanyId
                  goodsId = goodsId || GoodsList[0].GoodsId
                  year = year || now.year()
                  month = month || now.month() + 1
                  await dispatch({ type: 'GetSellDetailStatisticsForMonth', payload: { companyId, year, month, goodsId, state } })
                }
              }
            })
          },
    },
  
    effects: {
      // 获取商品列表
      *GetGoodsList({ payload }, { call, put, select }) {
        const { hasGoodsList } = yield select(state => state.statistics)
        if (hasGoodsList) {
          return yield select(state => state.statistics.GoodsList)
        }
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(statisticsService.GetGoodsList, { 
          body: { 
            userId
          }, 
          headers: { 
            Authorization: JwtToken 
          }
        });
        if (ret === 1001) {
          const [{ GoodsId }] = data
          yield put({ 
            type: 'save', 
            payload: { 
              goodsId: GoodsId,
              hasGoodsList: true, 
              GoodsList: data
            } 
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasGoodsList: false, 
              GoodsList: null, 
              GoodsListCode: code 
            }
          });
          return false
        }
      },
      // 获得销售记录(当月)
      *GetSaleStatistics({ payload: { companyId, goodsId, year, month } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(statisticsService.GetSaleStatistics, { 
          body: { 
            userId, 
            companyId, 
            goodsId, 
            year, 
            month
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
              hasSaleStatistics: true, 
              SaleStatistics: data,
              SaleStatisticsCode: ''
            }
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasSaleStatistics: false,
              SaleStatistics: null,
              SaleStatisticsCode: code 
            }
          });
          return false
        }
      },
      // 获得查询日各个公司查询销售总数
      *GetSaleStatisticsForDay({ payload: { goodsId, selectTime } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(statisticsService.GetSaleStatisticsForDay, { 
          body: { 
            userId, 
            goodsId, 
            selectTime
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        })
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              selectTime,
              hasSaleStatisticsForDay: true, 
              SaleStatisticsForDay: data,
              SaleStatisticsForDayCode: '' 
            }
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              selectTime: null,
              hasSaleStatisticsForDay: false, 
              SaleStatisticsForDay: null, 
              SaleStatisticsForDayCode: code
            } 
          });
          return false
        }
        
      },
      // 获得查询月各个公司查询销售总数
      *GetSaleStatisticsForMonth({ payload: { goodsId, year, month  } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(statisticsService.GetSaleStatisticsForMonth, { 
          body: { 
            userId, 
            goodsId, 
            year, 
            month  
          },
          headers: { 
            Authorization: JwtToken 
          } 
        })
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              year,
              month,
              hasSaleStatisticsForMonth: true, 
              SaleStatisticsForMonth: data,
              SaleStatisticsForMonthCode: ''
            } 
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasSaleStatisticsForMonth: false, 
              SaleStatisticsForMonth: null, 
              SaleStatisticsForMonthCode: code 
            } 
          });
          return false
        }
        
      },
      // 获得公司指定日全部销售详情
      *GetSellDetailStatisticsForDay({ payload: { year, month, day, state = 1, goodsId  } }, { call, put, select }) {
        const { JwtToken, userId, companyId } = yield select(state => state.users.userInfo)
        const { data } = yield call(statisticsService.GetSellDetailStatisticsForDay, { 
          body: { 
            userId, 
            companyId,
            year, 
            month,
            day, 
            state, 
            goodsId 
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
              day,
              hasSellDetailStatisticsForDay: true, 
              SellDetailStatisticsForDay: data,
              SellDetailStatisticsForDayCode: ''
            } 
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasSellDetailStatisticsForDay: false, 
              SellDetailStatisticsForDay: null, 
              SellDetailStatisticsForDayCode: code 
            } 
          });
          return false
        }
        
      },
      // 获得公司每月全部销售详情 
      *GetSellDetailStatisticsForMonth({ payload: { companyId, year, month, state = 1, goodsId } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(statisticsService.GetSellDetailStatisticsForMonth, { 
          body: { 
            userId, 
            companyId,
            year, 
            month,
            state, 
            goodsId 
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
              hasSellDetailStatisticsForMonth: false, 
              SellDetailStatisticsForMonth: null, 
              SellDetailStatisticsForMonthCode: code 
            } 
          });
          return false
        }
        
      },
    },
    reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        }
    },
  
  };
  
  