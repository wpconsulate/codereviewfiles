import { Component } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Table, Empty, DatePicker } from 'antd'
import { SaleStatisticsForDayColumns } from '../../TableConfig'
import moment, { dateFormat } from '../../utils/moment'

const Title = ({ query: { selectTime } }) => moment.unix(selectTime).format(dateFormat)

export default connect(state => (
    {
        location: state.routing.location,
        goodsId: state.statistics.goodsId,
        selectTime: state.statistics.selectTime,
        hasSaleStatisticsForDay: state.statistics.hasSaleStatisticsForDay,
        SaleStatisticsForDay: state.statistics.SaleStatisticsForDay,
        SaleStatisticsForDayCode: state.statistics.SaleStatisticsForDayCode,
        loading: state.loading.models.statistics,
    }
))(class SaleStatisticsForDay extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                hasSaleStatisticsForDay: false,
                SaleStatisticsForDay: null,
                SaleStatisticsForDayCode: '',
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

        router.replace(`/statistics/SaleStatisticsForDay?goodsId=${goodsId}&selectTime=${date.unix()}`)
    }

    onClick ({ goodsId }) {
        let date = moment.unix(this.props.selectTime),
            year = date.year(),
            month = date.month() + 1,
            day = date.date()

        router.replace(`/statistics/SellDetailStatisticsForDay?goodsId=${goodsId}&year=${year}&month=${month}&day=${day}`)
    }

    render () {
        let {
            location,
            loading,
            hasSaleStatisticsForDay,
            SaleStatisticsForDay,
            SaleStatisticsForDayCode,
        } = this.props

        let selectTime = moment.unix(location.query.selectTime),
            year = selectTime.year(),
            month = selectTime.month() + 1,
            day = selectTime.date()

        let dataSource = []

        if (hasSaleStatisticsForDay) {
            dataSource = SaleStatisticsForDay.map((item, index) => ({ ...item, key: `SaleStatisticsForDay_${index}`}) )
        }
        return <div>
            <DatePicker placeholder="请选择年月日" onChange={this.onChange.bind(this)} defaultValue={moment(`${year}/${month}/${day}`, dateFormat)} format={dateFormat}/>
            <br />
            {
                hasSaleStatisticsForDay ? 
                    <Table 
                    title={() => <Title {...location} />}
                    onRow={record => ({
                        onClick: this.onClick.bind(this, record)
                    })
                    }
                    columns={SaleStatisticsForDayColumns}
                    dataSource={dataSource} 
                    loading={loading} 
                    size={'middle'}
                    pagination={false} /> : <Empty description={SaleStatisticsForDayCode} />
            }
        </div>
    }
})