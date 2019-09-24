import { Component } from 'react'
import { connect } from 'dva'
import { DatePicker, Table, Empty } from 'antd'
import { StockHistoryColumns } from '../../TableConfig'
import router from 'umi/router'
import moment, { monthFormat } from '../../utils/moment'
import { OpTypes } from '../../OpTypConfig'

const Title = ({ titles }) => titles.map(item => <span key={item.OpType}>{OpTypes.map(optype => optype.value === item.OpType && optype.text)}:&nbsp;<a>{item.Num}</a>件&nbsp;&nbsp;</span>)


export default connect(state => (
    {
        location: state.routing.location,
        StockHistoryLimit: state.warehouse.StockHistoryLimit,
        hasStockHistory: state.warehouse.hasStockHistory,
        StockHistory: state.warehouse.StockHistory,
        StockHistoryCode: state.warehouse.StockHistoryCode,
        loading: state.loading.models.warehouse
    }
))(class StockHistory extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
            hasStockHistory: false, 
            StockHistory: null, 
            StockHistoryCode: '',
        } })
    }

    onClick ({ CompanyId, CreateTime }) {
        router.push(`/warehouse/StockHistoryDetail?companyId=${CompanyId}&time=${CreateTime}`)
    }

    onChange (date, dateString) {
        if (!date) {
            return
        }
        let year = date.year(),
            month = date.month() + 1
        let { companyId } = this.props.location.query
        router.replace(`/warehouse/StockHistory?companyId=${companyId}&year=${year}&month=${month}`)
    }

    render () {
        let {
            location,
            loading,
            hasStockHistory, 
            StockHistory, 
            StockHistoryCode, 
        } = this.props

        let { year, month } = location.query

        let dataSource = []

        if (hasStockHistory && StockHistory.historyList) {
            dataSource = StockHistory.historyList.map(item => ({ ...item, key: `hasStockHistory_${item.MaterialOpId}`}))
        }

        return <div> 
                <DatePicker.MonthPicker onChange={this.onChange.bind(this)} placeholder="请选择年月" defaultValue={moment(`${year}-${month}`, monthFormat)} />
                <br />
                <br />
                {
                    hasStockHistory &&  StockHistory.historyList ? 
                    <Table
                        title={() => <Title titles={StockHistory.historySumList} />}
                        onRow={record => ({
                            onClick: this.onClick.bind(this, record)
                        })}
                        columns={StockHistoryColumns}
                        dataSource={dataSource}
                        loading={loading}
                        pagination={false} /> : <Empty description={StockHistoryCode} />
                }
            </div>
    }
}) 