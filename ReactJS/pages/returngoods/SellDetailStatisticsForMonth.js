import { Component } from 'react' 
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Col, DatePicker, Table, Empty } from 'antd'
import { SellDetailStatisticsForMonthColumns } from '../../TableConfig'
import moment, { monthFormat } from '../../utils/moment'

const Title = ({ year, month, buyoutCount, rentCount }) => (
    <Row>
        <span>{`${year}年${month}月`}</span>
        <br />
        <br />
        <span>正销版{buyoutCount}件</span>
        &nbsp;
        &nbsp;
        <span>租用版{rentCount}件</span>
    </Row>
)
export default connect(state => (
    {
        companyId: state.home.companyId,
        companyName: state.home.companyName,
        year: state.returngoods.year,
        month: state.returngoods.month,
        hasSellDetailStatisticsForMonth: state.returngoods.hasSellDetailStatisticsForMonth,
        SellDetailStatisticsForMonth: state.returngoods.SellDetailStatisticsForMonth,
        SellDetailStatisticsForMonthCode: state.returngoods.SellDetailStatisticsForMonthCode,
        loading: state.loading.models.returngoods,
    }
))(class SellDetailStatisticsForMonth extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                year: 0,
                month: 0,
                hasSellDetailStatisticsForMonth: false,
                SellDetailStatisticsForMonth: null,
                SellDetailStatisticsForMonthCode: '',
            } 
        })
    }


    onChange (date, dateString) {
        if (!date) {
            return
        }

        let {
            companyId,
        } = this.props

        let year = date.year(),
            month = date.month() + 1

        router.push(`/returngoods/SellDetailStatisticsForMonth?companyId=${companyId}&year=${year}&month=${month}&goodsId=-1&$state=2`)
       
    }

    render () {
        let {
            loading,
            year,
            month,
            hasSellDetailStatisticsForMonth,
            SellDetailStatisticsForMonth,
            SellDetailStatisticsForMonthCode,
        } = this.props

        let dataSource = []

        if (hasSellDetailStatisticsForMonth) {
            dataSource = SellDetailStatisticsForMonth.saleDetailList.map(item => ({ ...item, key: `SellDetailStatisticsForMonth_${item.Id}`}) )
        }

        return <Row>
            <Row>
                <Col>
                {
                    year && month && <DatePicker.MonthPicker placeholder="请选择年月" onChange={this.onChange.bind(this)} defaultValue={moment(`${year}-${month}`, monthFormat)} format={monthFormat}/> 
                }
                </Col>
            </Row>
            <br />
            {
                  hasSellDetailStatisticsForMonth ? <Table 
                  title={() => <Title {...SellDetailStatisticsForMonth} {...this.props}/>}
                  columns={SellDetailStatisticsForMonthColumns}
                  dataSource={dataSource} 
                  loading={loading} 
                  size={'middle'}
                  pagination={false} /> : <Empty description={SellDetailStatisticsForMonthCode} />
            }
        </Row>
    }
})