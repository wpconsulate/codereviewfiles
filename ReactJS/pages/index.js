import { Component } from 'react';
import { connect } from 'dva';


export default connect(state => (
  {
    ...state.users,
    ...state.home,
  }
))(class IndexPage extends Component {
  render () {
    return '阿布跑跑商家后台管理'
  }
});
