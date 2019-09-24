import { Component } from 'react'
import { LocaleProvider, Layout } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import styles from './index.css';
import HeaderNavigation from './Header';
import Navigation from './Navigation';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import CheckRoutePath from '../checkRoutePath'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Header, Sider, Content } = Layout;

class LayoutPage extends Component {
  async componentDidMount () {
   
  }
  render() {
    let {
      collapsed,
      location,
      children,
    } = this.props

    if (CheckRoutePath.includes(location.pathname)) {
      return <main style={{height: '100%'}}>{ children }</main>
    }
    return (
      <LocaleProvider locale={zh_CN}>
        <Layout className={styles.normal}>
          <Header style={{padding: 0}}> <HeaderNavigation location={location} /></Header>
          <Layout>
            <Sider collapsed={collapsed}><Navigation location={location} /></Sider>
            {/* <Navigation location={location} /> */}
            <Content style={{padding: '20px'}}> {children}</Content>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.navigation
  };
}


export default withRouter(connect(mapStateToProps)(LayoutPage));