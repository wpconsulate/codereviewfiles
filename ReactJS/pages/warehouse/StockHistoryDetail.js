import { Component } from 'react'
import { connect } from 'dva'
import { Table, Empty } from 'antd'
import { StockHistoryDetailColumns } from '../../TableConfig'
// import router from 'umi/router';

export default connect(state => (
    {
        hasStockHistoryDetail: state.warehouse.hasStockHistoryDetail,
        StockHistoryDetail: state.warehouse.StockHistoryDetail,
        StockHistoryDetailCode: state.warehouse.StockHistoryDetailCode,
        loading: state.loading.models.warehouse
    }
))(class StockHistoryDetail extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
            hasStockHistoryDetail: false, 
            StockHistoryDetail: null, 
            StockHistoryDetailCode: '',
        } })
    }

    render () {
        let {
            loading,
            hasStockHistoryDetail, 
            StockHistoryDetail, 
            StockHistoryDetailCode, 
        } = this.props

        let dataSource = []

        if (hasStockHistoryDetail) {
            dataSource = StockHistoryDetail.map(item => ({ ...item, key: `StockHistoryDetail_${item.MaterialOpId}`}))
        }

        return hasStockHistoryDetail ? <Table
                    columns={StockHistoryDetailColumns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false} /> : <Empty description={StockHistoryDetailCode} />
    }
}) 