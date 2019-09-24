
// export default {

//   namespace: 'example',

//   state: {},

//   subscriptions: {
//     setup({ dispatch, history }) {
//     },
//   },

//   effects: {
//     *fetch({ payload }, { call, put }) {
//       yield put({ type: 'save' });
//     },
//   },

//   reducers: {
//     save(state, action) {
//       return { ...state, ...action.payload };
//     },
//   },

// };

// import * as usersService from '../services/users';

export default {
    namespace: 'users',
    state: {
      hasUserInfo: false,
      userInfo: null,
    },
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload};
      },
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(async ({ pathname, query }) => {
          if (pathname === '/') {
            const result = await dispatch({ type: 'GetLocalStorage' })
            if (!result) {
              history.push('/login')
            }

            await dispatch({ type: 'home/GetHomeData' })
          }
        });
      },
    },
    effects: {
      *GetLocalStorage({ payload }, { call, put, select }) {
        const { hasUserInfo } = yield select(state => state.users)
        if (hasUserInfo) {
          return yield select(state => state.users.userInfo)
        }
        const result = localStorage.getItem('userInfo')
        if (!result) {
          return false
        }
        let userInfo = JSON.parse(result)
        yield put({ type: 'save', payload: { hasUserInfo: true, userInfo } });
        return userInfo
      },
      *SetLocalStorage({ payload: { userInfo } }, { call, put, select }) {
        if (!userInfo) {
          return false
        } 
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        yield put({ type: 'save', payload: { hasUserInfo: true, userInfo } });
        return userInfo
      },
      *RemoveLocalStorage({ payload }, { call, put, select }) {
        localStorage.removeItem('userInfo')
        yield put({ type: 'save', payload: { hasUserInfo: false, userInfo: null } });
        return true
      },
    },
  };