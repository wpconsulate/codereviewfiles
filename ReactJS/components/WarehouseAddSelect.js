import  { connect } from 'dva'
import { Row, Col, Select, Button } from 'antd';

function WarehouseAddSelect (props) {
    let {
        dispatch,
        hasGoodsList,
        GoodsList,
        loading,
    } = props
    function handleSelectChangeGoodsId(value) {
        dispatch({ type: 'warehouse/add', payload: { goodsId: value } })
    }
    function handleClick () {
        dispatch({type: 'warehouse/SetGoodsCarts', payload: null })
    }
    return (
    hasGoodsList ?
    <Row style={{ marginBottom: '20px' }}>
        <Col span={12}>
            <Select defaultValue={GoodsList[0] && GoodsList[0].GoodsName} style={{ width: 190, marginRight: '20px' }} onChange={handleSelectChangeGoodsId} loading={loading}>
                {
                    GoodsList.map((goodsItem) => <Select.Option key={goodsItem.GoodsName} value={goodsItem.GoodsId}>{goodsItem.GoodsName}</Select.Option>)
                }
            </Select>
            <Button type="primary" shape="circle" icon="plus" loading={loading} onClick={handleClick} />
        </Col>
    </Row> : null
    )
    
}


function mapStateToProps (state) {
    return {
        ...state.statistics,
        loading: state.loading.models.statistics,
    }
}

export default connect(mapStateToProps)(WarehouseAddSelect)