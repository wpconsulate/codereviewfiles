import { Component } from 'react'
import { connect } from 'dva'
// import router from 'umi/router'
import { Table, Empty, Tabs } from 'antd'
import { SellDetailStatisticsForMonthColumns } from '../../TableConfig'
// import moment, { monthFormat } from '../../utils/moment'

const TabPane = Tabs.TabPane;

export default connect(state => (
    {
        buyout: state.statistics.buyout,
        hasSellDetailStatisticsForMonth: state.statistics.hasSellDetailStatisticsForMonth,
        SellDetailStatisticsForMonth: state.statistics.SellDetailStatisticsForMonth,
        SellDetailStatisticsForMonthCode: state.statistics.SellDetailStatisticsForMonthCode,
        loading: state.loading.models.statistics
    }
))(class SellDetailStatisticsForMonth extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                hasSellDetailStatisticsForMonth: false, 
                SellDetailStatisticsForMonth: null,
                SellDetailStatisticsForMonthCode: '',
            } 
        })
    }

    onChange (buyout) {
        this.props.dispatch({ type: 'warehouse/save', payload: { buyout } })
    }
    
    render () {
        let {
            loading,
            buyout,
            hasSellDetailStatisticsForMonth,
            SellDetailStatisticsForMonth,
            SellDetailStatisticsForMonthCode,
        } = this.props


        let dataSource1 = []
        let dataSource2 = []

        if (hasSellDetailStatisticsForMonth && SellDetailStatisticsForMonth.saleDetailList.length) {
            dataSource1 = SellDetailStatisticsForMonth.saleDetailList.map(item => item.Buyout === 1 && { ...item, key: `SellDetailStatisticsForMonth_${item.Id}`}).filter(item => item)
            dataSource2 = SellDetailStatisticsForMonth.saleDetailList.map(item => item.Buyout === 2 && { ...item, key: `SellDetailStatisticsForMonth_${item.Id}`}).filter(item => item)
        }

        return hasSellDetailStatisticsForMonth && SellDetailStatisticsForMonth.saleDetailList.length ? 
            <Tabs defaultActiveKey={buyout} onChange={this.onChange.bind(this)}>
                <TabPane tab={`租用版${dataSource2.length}`} key="2">
                    {
                        dataSource2.length ? <Table 
                            columns={SellDetailStatisticsForMonthColumns}
                            dataSource={dataSource2} 
                            loading={loading} 
                            size={'middle'}
                            pagination={false} />  : <Empty />
                    }
                </TabPane>
                <TabPane tab={`正销版${dataSource1.length}`} key="1">
                    {
                        dataSource1.length ? <Table
                            columns={SellDetailStatisticsForMonthColumns}
                            dataSource={dataSource1}
                            loading={loading}
                            size={'middle'}
                            pagination={false} /> : <Empty />
                    }
                </TabPane>
            </Tabs> : <Empty description={SellDetailStatisticsForMonthCode} />
                
    }
})