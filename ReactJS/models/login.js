import * as usersService from '../services/login';
import router from 'umi/router';
export default {
    namespace: 'login',
    state: {
      hasCode: false,
      codeType: null,
      codeText: null
    },
    reducers: {
      save (state, action) {
        return { ...state, ...action.payload }
      },
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(async ({ pathname, query }) => {
          if (pathname === '/login') {
            const result = await dispatch({ type: 'users/GetLocalStorage' })
            if (result) {
              history.push('/')
            }
          }
        });
      },
    },
    effects: {
      *LoginAccount({ payload: { phone, password }}, { call, put }) {
        const { data } = yield call(usersService.LoginAccount, {phone, password});
        if (data.ret === 1001) {
          localStorage.setItem('userInfo', JSON.stringify(data))
          // yield put({ type: 'save', payload: { hasCode: true, codeType: 'success', codeText: data.code } });
          yield put({ type: 'users/save', payload: { hasUserInfo: true, userInfo: data } });
          yield router.push('/')
        }
        if (data.ret === 1002) {
          yield put({ type: 'save', payload: { hasCode: true, codeType: 'error', codeText: data.code } });
        }
      },
      *SendForgetPasswordMessage({ payload: { phone } }, { call, put }) {
        const { data } = yield call(usersService.SendForgetPasswordMessage, { phone });
        if (data.ret === 1001) {
          yield put({ type: 'save', payload: { hasCode: true, codeType: 'success', codeText: data.code } });
        }
        if (data.ret === 1002) {
          yield put({ type: 'save', payload: { hasCode: true, codeType: 'error', codeText: data.code } });
        }
      },
      *UpdatePasswordForget({ payload: { phone, password, vcode} }, { call, put }) {
        const { data } = yield call(usersService.UpdatePasswordForget,  { phone, password, vcode} );
        if (data.ret === 1001) {
          yield put({ type: 'save', payload: { hasCode: true, codeType: 'success', codeText: data.code } });
        }
        if (data.ret === 1002) {
          yield put({ type: 'save', payload: { hasCode: true, codeType: 'error', codeText: data.code } });
        }
      },
    },
  };