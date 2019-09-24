import { Component } from 'react'
import { connect } from 'dva'
import { Row, Col, Input, Button, Icon, DatePicker, Table, Empty, message, Modal, Radio } from 'antd'
import { FixingIdDetailForSimpleForWebColumns } from '../../TableConfig'
import moment, { minuteFormat } from '../../utils/moment';
import  { buyouts } from '../../BuyoutConfig'

const Title = ({total}) => <span>录入设备&nbsp;&nbsp;共：{total}件</span>

export default connect(state => (
    {
        companyId: state.home.companyId,
        companyName: state.home.companyName,
        Buyout: state.addsale.Buyout,
        saleTime: state.addsale.saleTime,
        visible: state.addsale.visible,
        FixingIdDetailForWeb: state.addsale.FixingIdDetailForWeb,
        hasFixingIdDetailForWeb: state.addsale.hasFixingIdDetailForWeb,
        FixingIdDetailForWebs: state.addsale.FixingIdDetailForWebs,
        FixingIdDetailForWebCode: state.addsale.FixingIdDetailForWebCode,
        loading: state.loading.models.addsale,
    }
))(class IndexPage extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'addsale/save', payload: {
                FixingIdDetailForWeb: null,
                hasFixingIdDetailForWeb: false,
                FixingIdDetailForWebs: [],
                FixingIdDetailForWebCode: ''
            } 
        })
    }


    onPressEnter (e) {
        if (!e.target.value) {
            return message.warning('设备号不能为空')
        }
        if (e.target.value.length !== 15) {
            return message.warning('请输入15位长度正确的设备号')
        }
        if (this.props.FixingIdDetailForWebs.some(item => item.FixingId === e.target.value)) {
            return message.warning('请勿重复添加设备号')
        }
        this.props.dispatch({ type: 'addsale/GetFixingIdDetailForWeb', payload: { fixingId: e.target.value } })
    }

    onChange (date, dateString) {
        if (!date) {
            return
        }

        this.props.dispatch({ type: 'addsale/save', payload: { saleTime: date.unix() } })
    }

    onClick () {
        let {
            dispatch,
            companyId,
            saleTime,
            FixingIdDetailForWebs,
        } = this.props

        let priceId = FixingIdDetailForWebs.map(item => item.PriceId).join('##'),
            fixingIds = FixingIdDetailForWebs.map(item => item.FixingId).join('##'),
            buyout = FixingIdDetailForWebs.map(item => item.Buyout).join('##')

        dispatch({ type: 'addsale/AddSaleStatistics', payload: { companyId, priceId, fixingIds, saleTime, buyout } })
    }
   

    onChangeRadio (e) {
        this.props.dispatch({ 
            type: 'addsale/save',
            payload: {
                Buyout: e.target.value
            } 
        })
    }
    onOk () {
        let {
            dispatch,
            Buyout,
            FixingIdDetailForWeb,
            FixingIdDetailForWebs,
        } = this.props
        dispatch({ 
            type: 'addsale/save',
            payload: {
                Buyout: 1,
                visible: false,
                FixingIdDetailForWeb: null,
                hasFixingIdDetailForWeb: true,
                FixingIdDetailForWebs: [...FixingIdDetailForWebs, { ...FixingIdDetailForWeb, Buyout}],
                FixingIdDetailForWebsCode: '',
            } 
        })
    }

    onCancel () {
        this.props.dispatch({ 
            type: 'addsale/save',
            payload: {
                Buyout: 1,
                visible: false,
            } 
        })
       
    }

    render () {
        let {
            loading,
            companyName,
            Buyout,
            saleTime,
            visible,
            hasFixingIdDetailForWeb,
            FixingIdDetailForWebs,
            FixingIdDetailForWebCode,
        } = this.props

        let dataSource = []

        if (hasFixingIdDetailForWeb) {
            dataSource = FixingIdDetailForWebs.map(item => ({ ...item, key: `FixingIdDetailForSimpleForWeb_${item.Id}`}))
        }

        return <Row>
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
                    出库时间
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                    {
                        saleTime && <DatePicker placeholder="请选择出库日期" showTime onChange={this.onChange.bind(this)} defaultValue={moment(moment.unix(saleTime).format(minuteFormat))} format={minuteFormat}/> 
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
                    hasFixingIdDetailForWeb  && FixingIdDetailForWebs.length ? <Table 
                        title={() => <Title total={FixingIdDetailForWebs.length} />}
                        columns={FixingIdDetailForSimpleForWebColumns}
                        dataSource={dataSource} 
                        loading={loading} 
                        size={'middle'}
                        pagination={false} /> : <Empty description={FixingIdDetailForWebCode} />
                }
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    <Button type="primary" block disabled={!hasFixingIdDetailForWeb} onClick={this.onClick.bind(this)} >提交</Button>
                </Col>
            </Row>
            <Modal
                title="请选择版本"
                visible={visible}
                centered={true}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                okText="确认"
                cancelText="取消">
                <Row typpe="flex" align="middle" justify="center">
                    <Radio.Group options={buyouts} onChange={this.onChangeRadio.bind(this)} value={Buyout}/>
                </Row>
            </Modal>
        </Row>
    }
    
})