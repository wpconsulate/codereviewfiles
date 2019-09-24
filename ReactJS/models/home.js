import * as adminService from '../services/admin';
// import router from 'umi/router'

export default {

  namespace: 'home',

  state: {
        company: '',
        companyId: 0,
        companyName: '',
        hasHomeData: false,
        HomeData: null,
        HomeDataCode: '',
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(async ({ pathname, query }) => {
        // await dispatch({ type: 'GetHomeData' })
      });
    },
  },

  effects: {
    *GetHomeData({ payload }, { call, put, select }) {
      const { hasHomeData, HomeData } = yield select(state => state.home)
      if (hasHomeData) {
        return HomeData
      }
      const { JwtToken, userId, companyId  } = yield select(state => state.users.userInfo)
      const { data } = yield call(adminService.GetHomeData, { 
          body: { 
            userId, 
            companyId, 
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
      const { ret, code } = data
      if (ret === 1001) {
          let { CompanyList: [{ CompanyId, CompanyName }] } = data
          yield put({
              type: 'save',
              payload: {
                  company: `${CompanyId},${CompanyName}`,
                  companyId: CompanyId,
                  companyName: CompanyName,
                  hasHomeData: true,
                  HomeData: data,
                  HomeDataCode: '',
              }
          })
          return data
        }
        if (ret === 1002) {
            yield put({
                type: 'save',
                payload: {
                    company: '',
                    hasHomeData: false,
                    HomeData: null,
                    HomeDataCode: code,
                }
            })
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

