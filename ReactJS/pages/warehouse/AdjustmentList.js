import { Component } from 'react'
import { connect} from 'dva'
import { Tabs, Table, Empty, Button, Modal, Input } from 'antd'
import { AdjustmentListColumns } from '../../TableConfig'
import router from 'umi/router';

const TabPane = Tabs.TabPane;

export default connect(state => (
    {
        userType: state.users.userInfo.userType,
        companyId: state.home.companyId,
        status: state.warehouse.status,
        ApprovalAdjustmentPass0Visible: state.warehouse.ApprovalAdjustmentPass0Visible,
        ApprovalAdjustmentPass1Visible: state.warehouse.ApprovalAdjustmentPass1Visible,
        CancelAdjustmentVisible: state.warehouse.CancelAdjustmentVisible,
        adjustmentId: state.warehouse.adjustmentId,
        pass: state.warehouse.pass,
        reason: state.warehouse.reason,
        hasAdjustmentList: state.warehouse.hasAdjustmentList, 
        AdjustmentList: state.warehouse.AdjustmentList, 
        AdjustmentListCode: state.warehouse.AdjustmentListCode,
        loading: state.loading.models.warehouse,
    }
))(class AdjustmentList extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
            hasAdjustmentList: false, 
            AdjustmentList: null, 
            AdjustmentListCode: '',
        } })
    }

    onChangeGetAdjustmentList (status) {
        let { companyId } = this.props
        router.replace(`/warehouse/AdjustmentList?companyId=${companyId === 1 ? -1 : companyId}&status=${status}`)
    }

    onChangeInput (e) {
        this.props.dispatch({ type: 'warehouse/save', payload: { reason: e.target.value }})
    }

    onClick (key, adjustmentId, pass) {
        // 是否通过 0:驳回1:通过
        this.props.dispatch({ type: 'warehouse/save', payload: { [key]: true, adjustmentId, pass }})
    }

    onOKApprovalAdjustment () {
        let { 
            dispatch,
            adjustmentId,
            pass, 
            reason 
        } = this.props  

        dispatch({ type: 'warehouse/ApprovalAdjustment', payload: { adjustmentId,  pass, reason } })
    }

    onOkCancelAdjustment () {
        let { 
            dispatch,
            adjustmentId,
            reason 
        } = this.props  
        dispatch({ type: 'warehouse/CancelAdjustment', payload: { adjustmentId, reason } })
    }

    onClickFinishAdjustment (adjustmentId) {
        this.props.dispatch({ type: 'warehouse/FinishAdjustment', payload: { adjustmentId } })
    }
  

    onCancel(key) {
        this.props.dispatch({ type: 'warehouse/save', payload: { [key]: false, pass: 0, reason: '' }})
    }

    render () {
        let {
            loading,
            userType,
            status,
            ApprovalAdjustmentPass0Visible,
            ApprovalAdjustmentPass1Visible,
            CancelAdjustmentVisible,
            hasAdjustmentList,
            AdjustmentList,
            AdjustmentListCode,
        } = this.props

        let dataSource1 = []
        let dataSource2 = []


        let NewAdjustmentListColumns = [
            ...AdjustmentListColumns,
            {
                title: '操作',
                dataIndex: 'Status',
                render: (text, record) => {
                    if (text === 0) {
                        if (userType === 1) {
                            return  <div>
                                <Button onClick={this.onClick.bind(this, 'ApprovalAdjustmentPass0Visible', record.Id, 0)}>驳回</Button>&nbsp;&nbsp;
                                <Button type="primary" onClick={this.onClick.bind(this, 'ApprovalAdjustmentPass1Visible', record.Id, 1)}>同意</Button>
                            </div>
                        } 
                        if (userType === 2) {
                            return  <Button onClick={this.onClick.bind(this, 'CancelAdjustmentVisible', record.Id)}>取消</Button>
                        }
                    }
                    if (text === 1) {
                        return <Button type="primary" onClick={this.onClickFinishAdjustment.bind(this, record.Id)}>完成</Button>
                    }
                    if (text === 2) {
                        return<Button disabled>已完成</Button>
                    }
                    if (text === 3) {
                        return<Button disabled>已驳回</Button>
                    }
                    if (text === 4) {
                        return<Button disabled>已取消</Button>
                    }
                }
            },
        ]


        if (hasAdjustmentList && AdjustmentList) {
            dataSource1 = AdjustmentList.map(item => item.Status === 0 && { ...item, key: `AdjustmentList_${item.Id}`}).filter(item => item)
            dataSource2 = AdjustmentList.map(item => item.Status !== 0 && { ...item, key: `AdjustmentList_${item.Id}`}).filter(item => item)
        }

        return hasAdjustmentList ? <div>
            <Tabs defaultActiveKey={status} onChange={this.onChangeGetAdjustmentList.bind(this)}>
                <TabPane tab='待审批' key="0">
                    {
                        dataSource1.length ? <Table
                            columns={NewAdjustmentListColumns}
                            dataSource={dataSource1}
                            loading={loading}
                            pagination={false} /> : <Empty />
                    }
                </TabPane>
                <TabPane tab='已审批' key="1">
                    {
                        dataSource2.length ? <Table
                            columns={NewAdjustmentListColumns}
                            dataSource={dataSource2}
                            loading={loading}
                            pagination={false} /> : <Empty />
                    }
                </TabPane>
            </Tabs>
            <Modal
                title="请输入驳回的原因"
                visible={ApprovalAdjustmentPass0Visible}
                onOk={this.onOKApprovalAdjustment.bind(this)}
                onCancel={this.onCancel.bind(this, 'ApprovalAdjustmentPass0Visible')}
                >
               <Input placeholder="请输入驳回的原因" onChange={this.onChangeInput.bind(this)} />
            </Modal>
            <Modal
                title="请输入备注"
                visible={ApprovalAdjustmentPass1Visible}
                onOk={this.onOKApprovalAdjustment.bind(this)}
                onCancel={this.onCancel.bind(this, 'ApprovalAdjustmentPass1Visible')}
                >
               <Input placeholder="请输入备注" onChange={this.onChangeInput.bind(this)} />
            </Modal>
            <Modal
                title="请输入取消的原因"
                visible={CancelAdjustmentVisible}
                onOk={this.onOkCancelAdjustment.bind(this)}
                onCancel={this.onCancel.bind(this, 'CancelAdjustmentVisible')}
                >
               <Input placeholder="请输入取消的原因" onChange={this.onChangeInput.bind(this)} />
            </Modal>
        </div> : <Empty description={AdjustmentListCode} />
    }
})