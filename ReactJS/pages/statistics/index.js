
import { Component } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Select, DatePicker, Table, Empty } from 'antd'
import StatisticsChart from '../../components/StatisticsChart'
import moment, { monthFormat } from '../../utils/moment';
import { StatisticsColumns } from '../../TableConfig'

const StatisticsTableTitle = ()  => <span style={{ color: 'gray'}}>本月销售状态</span>


export default connect((state) => (
     {
        userType: state.users.userInfo.userType,
        companyId: state.home.companyId,
        goodsId: state.statistics.goodsId,
        hasGoodsList: state.statistics.hasGoodsList,
        GoodsList: state.statistics.GoodsList,
        GoodsListCode: state.statistics.GoodsListCode,
        year: state.statistics.year,
        month: state.statistics.month,
        hasSaleStatistics: state.statistics.hasSaleStatistics,
        SaleStatistics: state.statistics.SaleStatistics,
        SaleStatisticsCode: state.statistics.SaleStatisticsCode,
        loading: state.loading.models.statistics,
     }
))(class IndexPage extends Component{
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                goosdId: 0,
                hasGoodsList: false,
                GoodsList: null,
                GoodsListCode: '',
                year: 0,
                month: 0,
                hasSaleStatistics: false,
                SaleStatistics: null,
                SaleStatisticsCode: '',
            } 
        })
    }

    onChangeSelect (goodsId) {
        if (!goodsId) {
            return
        }
        let {
            dispatch,
            companyId,
            year,
            month,
        }  = this.props

        dispatch({ type: 'statistics/save', payload: { goodsId } })

        router.replace(`/statistics?companyId=${companyId}&goodsId=${goodsId}&year=${year}&month=${month}`)
    }

    onChangeDatePicker (date, dateString) {
        if (!date) {
            return
        }
        let {
            companyId,
            goodsId,
        } = this.props
    
        let year = date.year(),
            month = date.month() + 1
            
        router.replace(`/statistics?companyId=${companyId}&goodsId=${goodsId}&year=${year}&month=${month}`)
    }

    onClick ({ year, month, day }, event) {
        let { 
            userType,
            companyId,
            goodsId,
        } = this.props

        let selectTime = moment(`${year}-${month}-${day}`).unix()
        if (userType === 1 && companyId === 1) {
            return router.push(`/statistics/SaleStatisticsForDay?goodsId=${goodsId}&selectTime=${selectTime}`)
        }
        router.replace(`/statistics/SellDetailStatisticsForDay?goodsId=${goodsId}&year=${year}&month=${month}&day=${day}`)
    }

    render() {
        let {
            loading,
            hasGoodsList,
            GoodsList,
            year,
            month,
            hasSaleStatistics,
            SaleStatistics,
            SaleStatisticsCode,
        } = this.props

        let dataSource = []

        if (hasSaleStatistics) {
            dataSource = [...SaleStatistics.monthSales].reverse().map((item, index) => ({ monthSales: item, year, month, day: index + 1, ForDay: `${month}月${index + 1}日`, key: `SaleStatistics_${index}`}) ).reverse()
        }

        return <Row>
            {
                hasGoodsList && <Select defaultValue={GoodsList[0].GoodsName} onChange={this.onChangeSelect.bind(this)} loading={loading} style={{ marginRight: '20px' }}>
                {
                    GoodsList.map((goodsItem) => <Select.Option key={goodsItem.GoodsName} value={goodsItem.GoodsId}>{goodsItem.GoodsName}</Select.Option>)
                }
                </Select>
            }
            {
                year && month && <DatePicker.MonthPicker onChange={this.onChangeDatePicker.bind(this)} placeholder="请选择年月" defaultValue={moment(`${year}-${month}`, monthFormat)} />
            }
            <Row type="flex" justify="center">
                <StatisticsChart />
            </Row>
            {
                 hasSaleStatistics ? <Table 
                    onRow={record => ({
                            onClick: this.onClick.bind(this, record)
                    })}
                    title={StatisticsTableTitle}
                    columns={StatisticsColumns}
                    dataSource={dataSource} 
                    loading={loading} 
                    size={'middle'}
                    pagination={false} /> : <Empty description={SaleStatisticsCode} />
            }
        </Row>
    }
    
})
