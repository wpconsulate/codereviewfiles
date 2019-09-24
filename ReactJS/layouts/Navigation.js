import { Component } from 'react'
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import router from 'umi/router';

export default connect(state => (
  {
    ...state.users,
    ...state.home,
    ...state.navigation
  }
))(class Navigation extends Component{
  onClick ({ item, key, keyPath }) {
    // let {
    //   userInfo,
    //   companyId,
    // } = this.props
    // if (key === '/warehouse') {
    //   if (userInfo.userType === 1 && companyId === 1) {
    //     return router.push(`${key}/admin`)
    //   } else {
    //     return router.push(`${key}?companyId=${companyId}`)
    //   }
    // }
    return router.push(key)
  }
  render () {
    let { 
      location,
      collapsed
    } = this.props
    return <Menu
          onClick={this.onClick.bind(this)}
          selectedKeys={[location.pathname]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed} >
        <Menu.Item key="/">
          <Icon type="home" />
          <span>首页</span>
        </Menu.Item>
         <Menu.Item key="/statistics">
          <Icon type="rise" />
          <span>销售状态</span>
        </Menu.Item>
        <Menu.Item key="/warehouse">
          <Icon type="table" />
          <span>仓库管理</span>
        </Menu.Item>
        <Menu.Item key="/addsale">
          <Icon type="scan" />
          <span>扫码出库</span>
        </Menu.Item>
        <Menu.Item key="/balance">
          <Icon type="dollar" />
          <span>余额</span>
        </Menu.Item>
        <Menu.Item key="/returngoods">
          <Icon type="dollar" />
          <span>退货退款</span>
        </Menu.Item>
      </Menu>
  }

})
