import { Component } from 'react'
import { connect} from 'dva'
// import { Tabs, Table, Empty, Button, Modal, Input } from 'antd'
// import { AddAdjustmentColumns } from '../../TableConfig'
// import router from 'umi/router';

// const TabPane = Tabs.TabPane;

export default connect(state => (
    {
        userType: state.users.userInfo.userType,
        companyId: state.home.companyId,
        loading: state.loading.models.warehouse,
    }
))(class AddAdjustment extends Component {
    // componentWillUnmount() {
    //     this.props.dispatch({ type: 'warehouse/save', payload: {
           
    //     } })
    // }


    render () {
        // let {
        //     loading,
        //     userType,
        // } = this.props

        // let dataSource = []



        // if (hasAdjustmentList && AdjustmentList) {
        //     dataSource1 = AdjustmentList.map(item => item.Status === 0 && { ...item, key: `AdjustmentList_${item.Id}`}).filter(item => item)
        // }

        return 'AddAdjustment'
        // : <Empty description={AdjustmentListCode} />
    }
})