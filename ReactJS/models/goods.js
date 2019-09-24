import * as goodsService from '../services/goods';
// import router from 'umi/router';

export default {
    namespace: 'goods',
    state: {
      hasGoodSpecLists: false,
      goodSpecLists: null,
      // columnsMap: {},
      // hasTable: false,
      // dataSource: [],
      // columns: []
    },
    reducers: {
      handleGoodSpeclist(state, action) {
        return {...state, ...action.payload}
      },
      handleColumsMap(state, { payload: { columnsMap } }) {
        console.log('handleColumsMap', columnsMap)
        return {...state, columnsMap}
      },
    },
    effects: {
      *AdminAddgoodsData({ payload: formData }, { call, put, select }) {
        const { data } = yield call(goodsService.AdminAddgoodsData);
        console.log(data)
        // yield put({ type: 'users/SaveUserInfo', payload: { hasUserInfo: true, userInfo: data } });
      },
      *AdminGetGoodSpeclist({ payload }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(goodsService.AdminGetGoodSpeclist, { body: { userId }, headers: { Authorization: JwtToken } }, );
        yield put({ type: 'handleGoodSpeclist', payload: { hasGoodSpecLists: true, goodSpecLists: data.mainlist } });
      },
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (pathname === '/goods/add') {
            dispatch({ type: 'AdminGetGoodSpeclist'})
          }
        });
      }
    },
  };