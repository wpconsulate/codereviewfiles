import * as balanceService from '../services/balance';
// import router from 'umi/router';
import { year, month } from '../utils/moment'

export default {
    namespace: 'balance',
    state: {
      hasBalanceListForCompany: false,
      BalanceListForCompany: null,
      BalanceListForCompanyCode: ''
    },
    reducers: {
      save(state, action) {
        return {...state, ...action.payload}
      }
    },
    effects: {
      *GetBalanceListForCompany({ payload: { year, month } }, { call, put, select }) {
        const { JwtToken, userId, companyId } = yield select(state => state.users.userInfo)
        const { data } = yield call(balanceService.GetBalanceListForCompany, { 
          body: { 
            userId,
            companyId,
            year,
            month
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        const { code, ret } = data 
        if (ret === 1001) {
          yield put({ 
            type: 'save',
            payload: { 
              hasBalanceListForCompany: true,
              BalanceListForCompany: data,
              BalanceListForCompanyCode: ''
            }
          })
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save',
            payload: { 
              hasBalanceListForCompany: false,
              BalanceListForCompany: null,
              BalanceListForCompanyCode: code 
            }
          })
        }
        return data
      },
     
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (!~pathname.indexOf('balance')) {
            return
          }
          if (pathname === '/balance') {
            dispatch({ type: 'warehouse/GetWarehouseSumList' }).then(response => {
              dispatch({ type: 'GetBalanceListForCompany', payload: { year, month } })
            })
          }
         
        });
      }
    },
  };