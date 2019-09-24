import { Component } from 'react'
import { connect } from 'dva'
import { Input, Button, Table, Empty } from 'antd'
import router from 'umi/router'
import { WarehouseSumListColumns } from '../../TableConfig'

export default connect(state => (
     {
        companyId: state.home.companyId,
        userType: state.users.userInfo.userType,
        hasWarehouseSumList: state.warehouse.hasWarehouseSumList,
        WarehouseSumList: state.warehouse.WarehouseSumList,
        WarehouseSumListCode: state.warehouse.WarehouseSumListCode,
        loading: state.loading.models.warehouse
     }
))(class IndexPage extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                hasWarehouseSumList: false,
                WarehouseSumList: null,
                WarehouseSumListCode: '',
            } 
        })
    }
   
    onSearch (value) {
        if (!value) {
            return this.props.dispatch({ type: 'warehouse/GetWarehouseSumList' })
        }
        this.props.dispatch({ type: 'warehouse/SearchWarehouseSumList', payload: { where: value } })
    }

    onClick ({ CompanyId }) {
        router.push(`/warehouse/WarehouseDetail?companyId=${CompanyId}`)
    }

    onClickAdjustmentList () {
        let { companyId } = this.props
        router.push(`/warehouse/AdjustmentList?companyId=${companyId === 1 ?  -1 : companyId}&status=0`)
    }

    render () {
        let {
            companyId,
            // userType,
            loading,
            hasWarehouseSumList,
            WarehouseSumList,
            WarehouseSumListCode,
        } = this.props

        let dataSource = []

        if (hasWarehouseSumList) {
            dataSource = WarehouseSumList.map(item => ({ ...item, key: `WarehouseSumList_${item.CompanyId}`}))
        }

        return <div>
            {
                // userType === 1 && 
                <span><Button type="primary" onClick={this.onClickAdjustmentList.bind(this)}>调货记录</Button> <br /><br /></span>
            }
            {
                companyId === 1 && <span><Input.Search placeholder="搜索公司" onSearch={this.onSearch.bind(this)} /> <br />  <br /></span>
            }
            {
                hasWarehouseSumList ? <Table
                    onRow={record => ({
                        onClick: this.onClick.bind(this, record)
                    })}
                    columns={WarehouseSumListColumns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false} /> : <Empty description={WarehouseSumListCode} />
            }
        </div>
    }
})