import  { connect } from 'dva'
import { Row, Col, Button, Drawer, Radio, InputNumber } from 'antd';

function WarehouseAddDrawer (props) {
    let {
        dispatch,
        hasGoodsSpecMaterialList,
        goodsSpecMaterialList,
        goodsCarts,
    } = props

    function handleClose () {
        dispatch({ type: 'warehouse/save', payload: { hasGoodsSpecMaterialList: false, goodsSpecMaterialList: null } });
    }
    function handleInputNumberChange (value) {
        dispatch({ type: 'warehouse/save', payload: { number: value }})
    }
    function handleRadioGroupChange(e) {
        dispatch({ type: 'warehouse/SetGoodsCarts', payload: e.target.value })
    }
    function handleAddClick() {
        dispatch({ type: 'warehouse/saveGoodsCartMaterialList' })
    }

    return (
        hasGoodsSpecMaterialList ? 
        <Drawer
            title="商品采购"
            placement="right"
            width="458"
            onClose={handleClose}
            visible={hasGoodsSpecMaterialList}
            >
            { 
                goodsSpecMaterialList.materialList.map(materiaItem => {
                    // console.log(materiaItem, goodsCarts)
                    if (materiaItem.SpecId === goodsCarts.join(',')) {
                        // console.log(materiaItem.SpecId, goodsCarts.join(','))
                        return (
                            <Row gutter={20} style={{ marginBottom: '20px' }} key={materiaItem.Id}>
                                <Col span={5}><img style={{ width: '100%' }} src={materiaItem.GoodsImg} alt={materiaItem.SpecName}  /></Col>
                                <Col span={19}>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col span={24} style={{ color: '#1890ff'}}>¥<strong style={{ fontSize: '1.4em'}}>{materiaItem.Price}</strong></Col>
                                    </Row>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col span={24}>库存{materiaItem.Stock}件</Col>
                                    </Row>
                                    <Row style={{ marginBottom: '10px' }}>
                                        <Col span={24}>{materiaItem.SpecName}</Col>
                                    </Row>
                                </Col>
                            </Row>
                            
                        )
                    }
                    return null
                })
            }
            {
                goodsSpecMaterialList.specDatas.map((specData, specDataIndex) => 
                <div style={{ marginBottom: '20px' }} key={`specId_${specData.specId}`}>
                    <h4 style={{ marginBottom: '20px' }} >{specData.specName}</h4>
                    <Radio.Group buttonStyle="solid" onChange={handleRadioGroupChange} defaultValue={`${specDataIndex},${specData.specSub[0].Cid}`} size="small">
                    {
                        specData.specSub.map((specSubItem, specSubIndex) =>  <Radio disabled={specSubItem.disabled} key={`specSub_${specSubItem.Cid}`} value={`${specDataIndex},${specSubItem.Cid}`}>{specSubItem.Name}</Radio> )
                    }
                    </Radio.Group>
                    </div>
                    )
            }
            <Row style={{ marginBottom: '20px' }} >
                <Col> <InputNumber defaultValue={1} onChange={handleInputNumberChange} /></Col>
            </Row>
            <Row style={{ marginBottom: '20px' }} >
                <Col><Button type="primary" onClick={handleAddClick}>添加</Button></Col>
            </Row>
        </Drawer> : null
    )
    
}


function mapStateToProps (state) {
    return {
        ...state.warehouse,
        loading: state.loading.models.warehouse,
    }
}

export default connect(mapStateToProps)(WarehouseAddDrawer)