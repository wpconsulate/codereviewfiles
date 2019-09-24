
export default {

  namespace: 'navigation',

  state: {
    collapsed: false
  },

//   subscriptions: {
//     setup({ dispatch, history }) {
//     },
//   },

//   effects: {
//     *fetch({ payload }, { call, put }) {
//       yield put({ type: 'save' });
//     },
//   },

  reducers: {
    hanlderCollapsed(state, action) {
      return { ...state, ...action.payload };
    },
  },

};

