import { Component } from 'react'
import { connect} from 'dva'
import { Row, Col, Table, Empty, Button, Modal, InputNumber, Radio } from 'antd'
import { GoodsSpeclocalStorageColumns, GoodsSpecMaterialListColumns } from '../../TableConfig'
// import router from 'umi/router';

export default connect(state => (
    {
        goodsId: state.warehouse.goodsId,
        companyId: state.warehouse.companyId,
        specId: state.warehouse.specId,
        specIds: state.warehouse.specIds,
        number: state.warehouse.number,
        GoodsSpecVisible: state.warehouse.GoodsSpecVisible,
        hasGoodsSpecMaterialList: state.warehouse.hasGoodsSpecMaterialList,
        GoodsSpecMaterialList: state.warehouse.GoodsSpecMaterialList,
        GoodsSpecMaterialListCode: state.warehouse.GoodsSpecMaterialListCode,
        hasGoodsSpec: state.warehouse.hasGoodsSpec,
        GoodsSpec: state.warehouse.GoodsSpec,
        GoodsSpecCode: state.warehouse.GoodsSpecCode,
        hasGoodsSpeclocalStorage: state.warehouse.hasGoodsSpeclocalStorage,
        GoodsSpeclocalStorage: state.warehouse.GoodsSpeclocalStorage,
        GoodsSpeclocalStorageCode: state.warehouse.GoodsSpeclocalStorageCode,
        loading: state.loading.models.warehouse,
    }
))(class GoodsSpec extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'warehouse/save', payload: {
                companyId: 0,
                goodsId: 0,
                specId: null,
                GoodsSpecVisible: false,
                hasGoodsSpec: false,
                GoodsSpec: null,
                GoodsSpecCode: '',
                hasGoodsSpeclocalStorage: false,
                GoodsSpeclocalStorage: null,
                GoodsSpeclocalStorageCode: '',
            } 
        })
    }

    onClickGoodsSpecVisible () {
        let {
            dispatch,
            companyId,
            goodsId,
        } = this.props
        dispatch({ type: 'warehouse/GetGoodsSpec', payload: { companyId, goodsId } })
    }

    onClick () {

    }

    onOk () {
        let {
            dispatch,
            number,
            GoodsSpecMaterialList: [value],
            GoodsSpeclocalStorage,
        } = this.props
        if (!GoodsSpeclocalStorage) {
            GoodsSpeclocalStorage = []
        }
        dispatch({
            type: 'warehouse/save',
            payload: {
                specId: null,
                number: 1,
                GoodsSpecVisible: false,
                hasGoodsSpecMaterialList: false,
                GoodsSpecMaterialList: null,
                GoodsSpecMaterialListCode: '',
                hasGoodsSpeclocalStorage: true,
                GoodsSpeclocalStorage: [...GoodsSpeclocalStorage, {...value, Number: number}],
                GoodsSpeclocalStorageCode: ''
            }
        })
    }

    onCancel () {
        this.props.dispatch({ 
            type: 'warehouse/save', 
            payload: { 
                specId: null, 
                number: 1,
                GoodsSpecVisible: false, 
                hasGoodsSpecMaterialList: false, 
                GoodsSpecMaterialList: null 
            } 
        })
    }

    onChange (index, e) {
        let {
            dispatch,
            specId,
            GoodsSpec,
        } = this.props
        if (!specId) {
            specId = []
        }
        specId[index] = e.target.value
        let specIds = GoodsSpec.materialList.map(item => item.SpecId.includes(e.target.value) && item.SpecId.split(',').map(item => Number(item))).filter(item => item)
        dispatch({ type: 'warehouse/save', payload: { specId, specIds } })
        if (specId.filter(item => item).length === GoodsSpec.specDatas.length) {
            let GoodsSpecMaterialList = GoodsSpec.materialList.filter(item => item.SpecId === specId.join(',') && item)
            dispatch({ type: 'warehouse/save', payload: { hasGoodsSpecMaterialList: true, GoodsSpecMaterialList } })
        }
    }

    onChangeInputNumber (value) {
        this.props.dispatch({ type: 'warehouse/save', payload: { number: value } })
    }

    render () {
        let {
            loading,
            specId,
            specIds,
            GoodsSpecVisible,
            hasGoodsSpecMaterialList,
            GoodsSpecMaterialList,
            GoodsSpecMaterialListCode,
            hasGoodsSpec,
            GoodsSpec,
            // GoodsSpecCode,
            hasGoodsSpeclocalStorage,
            GoodsSpeclocalStorage,
            GoodsSpeclocalStorageCode,
        } = this.props

        let dataSource = []
        let dataSourceGoodsSpecMaterialList = []
        let SpecDatasOptions = []
        let newGoodsSpeclocalStorageColumns

        

        if (hasGoodsSpeclocalStorage) {
            dataSource = GoodsSpeclocalStorage.map(item => ({ ...item, key: `GoodsSpeclocalStorage_${item.Id}`}) )
        }

        if (hasGoodsSpecMaterialList) {
            dataSourceGoodsSpecMaterialList = GoodsSpecMaterialList.map(item => ({ ...item, key: `GoodsSpecMaterialList_${item.Id}`}))
        }

        if (hasGoodsSpec && specIds) {
            SpecDatasOptions = GoodsSpec.specDatas.map((specData, specDataIndex) => 
                specData.specSub.map(item => {
                    return { 
                        ...item, 
                        label: 
                        item.Name, 
                        value: item.Cid,
                        disabled: !specIds.some(specIdItem => specIdItem[specDataIndex] === item.Cid),
                    }
                })
            )
        }

        if (hasGoodsSpeclocalStorage) {
            newGoodsSpeclocalStorageColumns = [
                ...GoodsSpeclocalStorageColumns,
                {
                    title: '商品数量',
                    dataIndex: 'Number',
                    render: text => <span><a>{text}</a>件</span>
                },
            ]
        }

        return <Row>
            <Row>
                <Col>
                    <Button type="primary" onClick={this.onClickGoodsSpecVisible.bind(this)}>采购商品</Button>
                </Col>
            </Row>
            <br />
            {
                  hasGoodsSpeclocalStorage ? <Table
                    columns={newGoodsSpeclocalStorageColumns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false} /> : <Empty description={GoodsSpeclocalStorageCode} />
            }
            <br />
            <Row>
                <Col>
                    <Button type="primary" block onClick={this.onClick.bind(this)} disabled={!hasGoodsSpeclocalStorage}>完成</Button>
                </Col>
            </Row>
            <Modal
                title="商品采购"
                visible={GoodsSpecVisible}
                width={820}
                centered={true}
                okButtonProps={{
                    disabled: !hasGoodsSpecMaterialList
                }}
                onOk={this.onOk.bind(this)}
                onCancel={this.onCancel.bind(this)}
                >
                {
                    hasGoodsSpecMaterialList ? <Table
                    columns={GoodsSpecMaterialListColumns}
                    dataSource={dataSourceGoodsSpecMaterialList}
                    loading={loading}
                    size={'small'}
                    pagination={false} /> : <Empty description={GoodsSpecMaterialListCode} />
                }
                <br />
                {
                    hasGoodsSpec && GoodsSpec.specDatas.map((specData, specDataIndex) => 
                        <Row key={`specDatas_${specData.specId}`}>
                            <span>{specData.specName}</span>
                            <br />
                            <br />
                            <Radio.Group options={SpecDatasOptions[specDataIndex]} value={specId && specId[specDataIndex]} onChange={this.onChange.bind(this, specDataIndex)} size="small" />
                            <br />
                            <br />
                        </Row>
                    )
                }
                <span>数量</span>
                <br />
                <br />
                <InputNumber defaultValue={1} onChange={this.onChangeInputNumber.bind(this)} />
            </Modal>
        </Row>
    }
})