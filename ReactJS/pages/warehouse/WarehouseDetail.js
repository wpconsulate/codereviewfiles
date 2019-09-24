import { Component } from 'react'
import { connect } from 'dva'
import { Table, Empty, Button } from 'antd'
import router from 'umi/router';
import { WarehouseDetailColumns } from '../../TableConfig'
import { year, month } from '../../utils/moment'

const Title = ({ amount, stock, onClick }) => <span>总金额<a>{amount}</a>元&nbsp;&nbsp;余下库存<a>{stock}</a>件&nbsp;&nbsp;<Button type="primary" onClick={onClick}>历史库存</Button></span>


export default connect(state => (
     {
        ...state.routing,
        companyId: state.home.companyId,
        hasWarehouseDetail: state.warehouse.hasWarehouseDetail,
        WarehouseDetail: state.warehouse.WarehouseDetail,
        WarehouseDetailCode: state.warehouse.WarehouseDetailCode,
        loading: state.loading.models.warehouse
     }
))(class IndexPage extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
            hasWarehouseDetail: false,
            WarehouseDetail: null,
            WarehouseDetailCode: '' 
        } })
    }

    onClick ({ GoodsId, CompanyId }) {
        router.push(`/warehouse/WarehouseGoodsDetail?companyId=${CompanyId}&goodsId=${GoodsId}`)
    }

    onClickStockHistory () {
        let { companyId } = this.props
        router.push(`/warehouse/StockHistory?companyId=${companyId}&year=${year}&month=${month}`)
    }

    render () {
        let {
            loading,
            hasWarehouseDetail,
            WarehouseDetail,
            WarehouseDetailCode,
        } = this.props

        let dataSource = []

        if (hasWarehouseDetail && WarehouseDetail.goodsSumList) {
            dataSource = WarehouseDetail.goodsSumList.map(item => ({ ...item, key: `WarehouseDetail_${item.GoodsId}`}))
        }

        return hasWarehouseDetail && WarehouseDetail.goodsSumList ? <Table
                    title={() => <Title {...WarehouseDetail} onClick={this.onClickStockHistory.bind(this)}/>}
                    onRow={record => ({
                        onClick: this.onClick.bind(this, record)
                    })}
                    columns={WarehouseDetailColumns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false} /> : <Empty description={WarehouseDetailCode} />
    }
})