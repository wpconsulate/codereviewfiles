import { Component } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Table, Empty, DatePicker } from 'antd'
import { SaleStatisticsForMonthColumns } from '../../TableConfig'
import moment, { monthFormat } from '../../utils/moment'

const Title = ({ query: { year, month } }) => moment(`${year}-${month}`).format(monthFormat)

export default connect(state => (
    {
        location: state.routing.location,
        goodsId: state.statistics.goodsId,
        year: state.statistics.year,
        month: state.statistics.month,
        state: state.statistics.state,
        hasSaleStatisticsForMonth: state.statistics.hasSaleStatisticsForMonth,
        SaleStatisticsForMonth: state.statistics.SaleStatisticsForMonth,
        SaleStatisticsForMonthCode: state.statistics.SaleStatisticsForMonthCode,
        loading: state.loading.models.statistics,
    }
))(class SaleStatisticsForMonth extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                hasSaleStatisticsForMonth: false, 
                SaleStatisticsForMonth: null,
                SaleStatisticsForMonthCode: '',
            } 
        })
    }

    onChange (date, dateString) {
         if (!date) {
            return
        }
        let {
            goodsId,
        } = this.props

        let year = date.year(),
            month = date.month() + 1

        router.replace(`/statistics/SaleStatisticsForMonth?goodsId=${goodsId}&year=${year}&month=${month}`)
    }

    onClick ({ companyId, goodsId }) {
        let { 
            year,
            month,
            state,
        } = this.props
        router.push(`/statistics/SellDetailStatisticsForMonth?companyId=${companyId}&year=${year}&month=${month}&goodsId=${goodsId}&state=${state}`)
    }

    render () {
        let {
            location,
            loading,
            hasSaleStatisticsForMonth,
            SaleStatisticsForMonth,
            SaleStatisticsForMonthCode,
        } = this.props

        let { year, month } = location.query

        let dataSource = []

        if (hasSaleStatisticsForMonth) {
            dataSource = SaleStatisticsForMonth.map((item, index) => ({ ...item, key: `SaleStatisticsForMonth_${index}`}) )
        }
        
        return <div>
            <DatePicker.MonthPicker placeholder="请选择年月" onChange={this.onChange.bind(this)} defaultValue={moment(`${year}/${month}`, monthFormat)} format={monthFormat}/>
            <br />
            {
                hasSaleStatisticsForMonth ? 
                    <Table 
                    title={() => <Title {...location} />}
                    onRow={record => ({
                        onClick: this.onClick.bind(this, record)
                    })}
                    columns={SaleStatisticsForMonthColumns}
                    dataSource={dataSource} 
                    loading={loading} 
                    size={'middle'}
                    pagination={false} /> : <Empty description={SaleStatisticsForMonthCode} />
            }
        </div>
    }
})
