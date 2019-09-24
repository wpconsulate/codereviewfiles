import  { connect } from 'dva'
import { Table, Empty, Button, InputNumber, message } from 'antd';

function WarehouseAddTable (props) {
    let {
        dispatch,
        loading,
        hasGoodsCartMaterialList,
        goodsCartMaterialList,
        selectedRows,
    } = props,
    columns = [
        {
            title: '商品图片',
            dataIndex: 'GoodsImg',
            key: 'GoodsImg',
            render: (text, record, index) => <img src={text} style={{width: '48px', height: '62px'}} alt={record.GoodsName}/>
        },
        {
            title: '商品名称',
            dataIndex: 'GoodsName',
            key: 'GoodsName' 
        },
        {
            title: '商品规格',
            dataIndex: 'SpecName',
            key: 'SpecName' 
        },
        {
            title: '价格（元）',
            dataIndex: 'Price',
            key: 'Price' 
        },
        {
            title: '数量（件）',
            dataIndex: 'Number',
            key: 'Number',
            render: (text, record, index) =>  <InputNumber defaultValue={1} value={record.Number} onChange={handleInputNumber.bind(null, text, record, index)} />
        },
        {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (text, record, index) =>  <Button type="danger" onClick={handleRemoveClick.bind(null, text, record, index)}>删除</Button>
        }
    ],
    dataSource = []

    function handleInputNumber (text, record, index, value) {
        dispatch({ type: 'warehouse/setGoodsCartMaterialList', payload: { text, record, index, value }})
    }
    function onChange (selectedRowKeys, selectedRows) {
        dispatch({ type: 'warehouse/save', payload: { selectedRowKeys, selectedRows } })
    }
    function handleRemoveClick (text, record, index) {
        dispatch({ type: 'warehouse/remove', payload: { text, record, index } })
    }
    function handleShowModal () {
        if (!!selectedRows.length) {
            dispatch({ type: 'warehouse/GetWarehouseSumList' }).then(() => {
                dispatch({ type: 'warehouse/save', payload: { visible: true }})
            })
        } else {
            message.warning('请勾选采购商品');
        }
      
    }
  
    if (hasGoodsCartMaterialList) {
        goodsCartMaterialList.forEach((goodsItem, goodsIndex) => {
            if(goodsItem) dataSource.push({ ...goodsItem, key: `goodsCartMaterialList_${goodsItem.Id}` })
        })
    }
    return (
        hasGoodsCartMaterialList ?
        <div>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <span style={{margin: '0 20px'}}>总数（件）：
                {
                    !!selectedRows.length ? selectedRows.map(item => item.Number).reduce((accumulator, currentValue) => accumulator + currentValue) : 0
                }
                </span>
                <span style={{margin: '0 20px'}}>总价（元）：
                {
                    !!selectedRows.length ? selectedRows.map(item => item.Number * item.Price).reduce((accumulator, currentValue) => accumulator + currentValue) : 0
                }
                </span>
                <Button type="primary" onClick={handleShowModal}>完成</Button>
            </div>
            <Table
                rowSelection={{
                    onChange
                }}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={false} /> 
        </div>: <Empty style={{margin: '4rem'}} description="" />
    )
}


function mapStateToProps (state) {
    return {
        ...state.warehouse,
        loading: state.loading.models.warehouse
    }
}

export default connect(mapStateToProps)(WarehouseAddTable)