import { Component } from 'react'
import { connect } from 'dva'
import { Table, Empty } from 'antd'
import { SellDetailStatisticsForDayColumns } from '../../TableConfig'

const Title = ({ SellDetailStatisticsForDay: { limit }, year, month, day }) => {
    return <span><span>{year}年{month}月{day}日</span>&nbsp;&nbsp;<span style={{ color: 'gray'}}>销售出{limit}件</span></span>
}

export default connect(state => (
     {
        year: state.statistics.year,
        month: state.statistics.month,
        day: state.statistics.day,
        hasSellDetailStatisticsForDay: state.statistics.hasSellDetailStatisticsForDay,
        SellDetailStatisticsForDay: state.statistics.SellDetailStatisticsForDay,
        SellDetailStatisticsForDayCode: state.statistics.SellDetailStatisticsForDayCode,
        loading: state.loading.models.statistics
     }
))(class SellDetailStatisticsForDay extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                hasSellDetailStatisticsForDay: false,
                SellDetailStatisticsForDay: null,
                SellDetailStatisticsForDayCode: '',
            } 
        })
    }
    render () {
        let {
            loading,
            hasSellDetailStatisticsForDay,
            SellDetailStatisticsForDay,
            SellDetailStatisticsForDayCode,
        } = this.props

        let dataSource = []

        if (hasSellDetailStatisticsForDay && SellDetailStatisticsForDay.data.length) {
            dataSource =  SellDetailStatisticsForDay.data.map(item => ({ ...item, key: `SellDetailStatisticsForDay_${item.Id}` }))
        }
        return  (hasSellDetailStatisticsForDay && SellDetailStatisticsForDay.data.length) ? 
            <Table
                title={() => <Title {...this.props} />}
                columns={SellDetailStatisticsForDayColumns} 
                dataSource={dataSource} 
                loading={loading}
                pagination={false} /> : <Empty description={SellDetailStatisticsForDayCode} />
    }
})