import { Component } from 'react' 
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Col, Button, Icon, Input, DatePicker, Table, Empty, message } from 'antd'
import { FixingIdDetailForReturnGoodsForWebColumns } from '../../TableConfig'
import moment, { minuteFormat } from '../../utils/moment'

const Title = ({total}) => <span>录入设备&nbsp;&nbsp;共：{total}件</span>

export default connect(state => (
    {
        companyId: state.home.companyId,
        companyName: state.home.companyName,
        hasFixingIdDetailForReturnGoodsForWeb: state.returngoods.hasFixingIdDetailForReturnGoodsForWeb,
        FixingIdDetailForReturnGoodsForWeb: state.returngoods.FixingIdDetailForReturnGoodsForWeb,
        FixingIdDetailForReturnGoodsForWebCode: state.returngoods.FixingIdDetailForReturnGoodsForWebCode,
        returnTime: state.returngoods.returnTime,
        loading: state.loading.models.returngoods,
    }
))(class IndexPage extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'returngoods/save', payload: {
                hasFixingIdDetailForReturnGoodsForWeb: false,
                FixingIdDetailForReturnGoodsForWeb: [],
                FixingIdDetailForReturnGoodsForWebCode: '',
            } 
        })
    }

    onClickSellDetailStatisticsForMonth () {
        let { 
            companyId,
            returnTime
        } = this.props
        let date = moment.unix(returnTime),
            year = date.year(),
            month = date.month() + 1

        router.push(`returngoods/SellDetailStatisticsForMonth?companyId=${companyId}&year=${year}&month=${month}&goodsId=-1&$state=2`)
    }

    onPressEnter (e) {
        if (!e.target.value) {
            return message.warning('设备号不能为空')
        }
        if (e.target.value.length !== 15) {
            return message.warning('请输入15位长度正确的设备号')
        }
        if (this.props.FixingIdDetailForReturnGoodsForWeb.some(item => item.FixingId === e.target.value)) {
            return message.warning('请勿重复添加设备号')
        }
        this.props.dispatch({ type: 'returngoods/GetFixingIdDetailForReturnGoodsForWeb', payload: { fixingId: e.target.value } })
    }

    onChange (date, dateString) {
        if (!date) {
            return
        }

        this.props.dispatch({ type: 'returngoods/save', payload: { returnTime: date.unix() } })
    }

    onClickReturnGoods () {
        let {
            dispatch,
            FixingIdDetailForReturnGoodsForWeb,
            returnTime,
        } = this.props

        let fixingIds = FixingIdDetailForReturnGoodsForWeb.map(item => item.FixingId).join(',')

        dispatch({ type: 'returngoods/ReturnGoods', payload: { fixingIds, returnTime } })
    }

    render () {
        let {
            companyName,
            returnTime,
            loading,
            hasFixingIdDetailForReturnGoodsForWeb,
            FixingIdDetailForReturnGoodsForWeb,
            FixingIdDetailForReturnGoodsForWebCode,
        } = this.props

        let dataSource = []

        if (hasFixingIdDetailForReturnGoodsForWeb && FixingIdDetailForReturnGoodsForWeb.length) {
            dataSource = FixingIdDetailForReturnGoodsForWeb.map(item => ({ ...item, key: `FixingIdDetailForReturnGoodsForWeb_${item.Id}`}) )
        }

        return <Row>
             <Row>
                <Col span={24}>
                    <Button type="primary" onClick={this.onClickSellDetailStatisticsForMonth.bind(this)}>退货记录</Button>
                </Col>
            </Row>
            <br />
            <Row type="flex" align="middle">
                <Col span={12}>
                    所属公司
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    {companyName}
                </Col>
            </Row>
            <br />
            <Row type="flex" align="middle">
                <Col span={12}>
                    退货日期
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    { 
                        returnTime && <DatePicker placeholder="请选择退货日期" onChange={this.onChange.bind(this)} defaultValue={moment(moment.unix(returnTime).format(minuteFormat))} format={minuteFormat}/> 
                    }
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Input prefix={<Icon type="scan" />} placeholder="请输入设备号" onPressEnter={this.onPressEnter.bind(this)}/>
                </Col>
            </Row>
            <br />
            <Row>
                <Col>   
                {
                    hasFixingIdDetailForReturnGoodsForWeb  && FixingIdDetailForReturnGoodsForWeb.length ? <Table 
                        title={() => <Title total={FixingIdDetailForReturnGoodsForWeb.length} />}
                        columns={FixingIdDetailForReturnGoodsForWebColumns}
                        dataSource={dataSource} 
                        loading={loading} 
                        size={'middle'}
                        pagination={false} /> : <Empty description={FixingIdDetailForReturnGoodsForWebCode} />
                }
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Button type="primary" block disabled={!hasFixingIdDetailForReturnGoodsForWeb} onClick={this.onClickReturnGoods.bind(this)} >提交</Button>
                </Col>
            </Row>
        </Row>
    }
})