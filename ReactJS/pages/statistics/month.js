import { Component } from 'react'
import { connect } from 'dva'
import { Tabs, Table, Empty } from 'antd'
// import { StatisticsTableForMonthColumns } from '../../TableConfig'
import { now } from '../../utils/moment'

const TabPane = Tabs.TabPane;

export default connect(state => (
    {  
        ...state.routing,
        ...state.home,
        ...state.users,
        ...state.statistics,
        loading: state.loading.models.statistics
    }
))(class MonthPage extends Component {
    async componentDidMount () { 
        let {
            location,
            dispatch,
            hasUserInfo,
            companyId,
            hasHomeData,
            hasGoodsList,
            goodsId,
            year,
            month,
        } = this.props
            if (!hasUserInfo) {
            await dispatch({ type: 'users/GetLocalStorage' })
        }
        if (!hasHomeData) {
            const HomeData = await dispatch({ type: 'home/GetHomeData' })
            companyId = HomeData.CompanyList[0].CompanyId
        }
        if (!hasGoodsList) {
            const GoodsList = await dispatch({ type: 'statistics/GetGoodsList' })
            goodsId = GoodsList[0].GoodsId
        }
        if (!year && !month) {
            year = now.year()
            month = now.month() + 1
        }
        if (location.query.companyId) {
            companyId = location.query.companyId
        }
        await dispatch({ type: 'statistics/GetSellDetailStatisticsForMonth', payload: { companyId, goodsId, year, month } })
    }

    onChange (activeKey) {
        this.props.dispatch({ type: 'statistics/save', payload: { buyout: activeKey }})
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
            dataSource1 = SellDetailStatisticsForMonth.saleDetailList.map(item => item.Buyout === 1 && { ...item, key: `SellDetailStatisticsForMonth1_${item.Id}`} ).filter(item => item)
            dataSource2 = SellDetailStatisticsForMonth.saleDetailList.map(item => item.Buyout === 2 && { ...item, key: `SellDetailStatisticsForMonth2_${item.Id}`} ).filter(item => item)
        }
    
        return hasSellDetailStatisticsForMonth ? <Tabs defaultActiveKey={buyout} onChange={this.onChange.bind(this)}>
            <TabPane tab={`正销版（${dataSource1.length}）`} key="1">
            {
                dataSource1.length ? 
                <Table 
                    // columns={StatisticsTableForMonthColumns}
                    dataSource={dataSource1} 
                    loading={loading}
                    size={'middle'}
                    pagination={false} /> : <Empty />
            }
           </TabPane>
            <TabPane tab={`租用版（${dataSource2.length}）`} key="2">
            {
                dataSource2.length ?
                <Table 
                    // columns={StatisticsTableForMonthColumns}
                    dataSource={dataSource2} 
                    loading={loading} 
                    size={'middle'}
                    pagination={false} /> : <Empty />
            }
            </TabPane>
        </Tabs> : <Empty description={SellDetailStatisticsForMonthCode} />
    }
})