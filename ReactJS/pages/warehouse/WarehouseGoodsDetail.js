import { Component } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Row, Col, Button, Table, Empty } from 'antd'
import { WarehouseGoodsDetailColumns } from '../../TableConfig'

const Title = ({ amount, stock }) => <span>共<a>{stock}件</a>&nbsp;&nbsp;¥{amount}</span>

export default connect(state => (
    {
        companyId: state.home.companyId,
        userType: state.users.userInfo.userType,
        goodsId: state.warehouse.goodsId,
        hasWarehouseGoodsDetail: state.warehouse.hasWarehouseGoodsDetail,
        WarehouseGoodsDetail: state.warehouse.WarehouseGoodsDetail,
        WarehouseGoodsDetailCode: state.warehouse.WarehouseGoodsDetailCode,
        loading: state.loading.models.warehouse
    }
))(class WarehouseGoodsDetail extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
            hasWarehouseGoodsDetail: false,
            WarehouseGoodsDetail: null,
            WarehouseGoodsDetailCode: '',
        } })
    }

    onClick ({ CompanyId, GoodsId, SpecId }) {
        let params = []
        params.push(`companyId=${CompanyId || this.props.companyId}`)
        params.push(`goodsId=${GoodsId || this.props.goodsId}`)
        SpecId && params.push(`specId=${SpecId}`)
        router.push(`/warehouse/GoodsSpec?${params.join('&')}`)
    }

    render () {
        let {
            loading,
            userType,
            hasWarehouseGoodsDetail,
            WarehouseGoodsDetail,
            WarehouseGoodsDetailCode,
        } = this.props

        let dataSource = []

        if (hasWarehouseGoodsDetail &&  WarehouseGoodsDetail.materialList) {
            dataSource = WarehouseGoodsDetail.materialList.map(item => ({ ...item, key: `WarehouseGoodsDetail_${item.Id}`}))
        }

        return <Row>
            <Row>
                <Col>
                    {
                      userType === 2 &&  <Button type="primary" onClick={this.onClick.bind(this)}>商品采购</Button>
                    }
                </Col>
            </Row>
            <br />
            <Row>
                <Col>
                    {
                        hasWarehouseGoodsDetail &&  WarehouseGoodsDetail.materialList ? <Table
                            title={() => <Title {...WarehouseGoodsDetail} />}
                            onRow={record => ({
                                onClick: this.onClick.bind(this, record)
                            })}
                            columns={WarehouseGoodsDetailColumns}
                            dataSource={dataSource}
                            loading={loading}
                            pagination={false} /> : <Empty description={WarehouseGoodsDetailCode} />
                    }
                </Col>
            </Row>
        </Row>
    }
}) 