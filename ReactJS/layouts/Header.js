import { connect } from 'dva';
import router from 'umi/router';
import { Row, Col, Menu, Icon, Avatar, Button } from 'antd';
import RootCompanySelect from '../components/RootCompanySelect'
// import StatisticsSelect from '../components/StatisticsSelect'
// import StatisticsDatePickerMonthPicker from '../components/StatisticsDatePickerMonthPicker'


function Header(props) {
  const {
    dispatch,
    hasUserInfo,
    userInfo,
    collapsed,
  } = props
  let toggleCollapsed = (collapsed) => {
    dispatch({ type: 'navigation/hanlderCollapsed', payload: { collapsed } })
  }
  let onClick = async ({ item, key, keyPath }) => {
    if (key === '/logout') {
      const result = dispatch({ type: 'users/RemoveLocalStorage' })
      if (result) {
        return router.push('/login')
      }
    }
    router.push(key)
  }

  const style = {
    marginRight: '20px'
  }

  const Title = hasUserInfo && <span style={{ color: 'white' }}><Avatar src={userInfo.Icon}/>{userInfo.nickName}</span>
  return hasUserInfo && 
    <Row type="flex" align="middle">
      <Col span={2}>
        <Button type="primary" onClick={toggleCollapsed.bind(null, !collapsed)} style={{margin: '0 20px'}}>
          <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
      </Col>
      <Col span={18}>
        <RootCompanySelect style={style} />
        {/* <StatisticsSelect style={style} />
        <StatisticsDatePickerMonthPicker style={style} /> */}
      </Col>
      <Col span={4}>
        <Row type="flex" align="middle" justify="end">
          <Col span={12}></Col>
          <Col span={12}>
            <Menu mode="horizontal" theme="dark" onClick={onClick}>
            <Menu.SubMenu title={Title}>
                <Menu.Item key="/logout">退出登录</Menu.Item>
            </Menu.SubMenu>
          </Menu>
          
          </Col>
        </Row>
         
      </Col>
    </Row>
}

function mapStateToProps(state) {
  return {
    ...state.navigation,
    ...state.users,
    loading: state.loading.models.users
  };
}

export default connect(mapStateToProps)(Header)