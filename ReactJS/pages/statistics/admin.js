import { Component } from 'react'
import { connect } from 'dva'
import { Table, Empty } from 'antd'
import router from 'umi/router'
import { StatisticsAdminTableColumns } from '../../TableConfig'
import { now } from '../../utils/moment'


 export default connect(state => (
     {
         ...state.home,
         ...state.users,
         ...state.statistics,
         loading: state.loading.models.statistics
     }
 ))(class AdminPage extends Component {
    async componentDidMount () { 
        let {
            dispatch,
            hasUserInfo,
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
            await dispatch({ type: 'home/GetHomeData' })
        }
        if (!hasGoodsList) {
            const GoodsList = await dispatch({ type: 'statistics/GetGoodsList' })
            goodsId = GoodsList[0].GoodsId
        }
        if (!year && !month) {
            year = now.year()
            month = now.month() + 1
        }
        await dispatch({ type: 'statistics/GetSaleStatisticsForMonth', payload: { goodsId, year, month } })
    }

    async onClick ({ companyId }) {
        router.push(`/statistics/month?companyId=${companyId}`)
    }

    render () {
        let {
            loading,
            hasSaleStatisticsForMonth, 
            SaleStatisticsForMonth,
            SaleStatisticsForMonthCode,
        } = this.props

        let dataSource = []

        if (hasSaleStatisticsForMonth) {
            dataSource = SaleStatisticsForMonth.map((item, index) => ({ ...item, key: `SaleStatisticsForMonth_${index}`}) )
        }

        return hasSaleStatisticsForMonth ? 
            <Table 
                onRow={record => ({
                    onClick: this.onClick.bind(this, record)
                })}
                columns={StatisticsAdminTableColumns}
                dataSource={dataSource} 
                loading={loading} 
                size={'middle'}
                pagination={false} /> : <Empty description={SaleStatisticsForMonthCode} />
    }
})