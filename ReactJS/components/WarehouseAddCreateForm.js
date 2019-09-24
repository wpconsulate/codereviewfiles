import {
    Modal, Form, Input, DatePicker, Table
  } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
// import moment from 'moment';


  const WarehouseAddCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line
    class extends React.Component {
      render() {
        const { 
            loading,
            userInfo, 
            hasWarehouseSumList,
            warehouseSumList,
            selectedRows
        } = this.props
        const {
          visible, onCancel, onCreate, form,
        } = this.props;
        const { getFieldDecorator } = form;
        const columns = [
        {
            title: '商品图片',
            dataIndex: 'GoodsImg',
            key: 'GoodsImg',
            render: (text, record, index) => <img src={text} style={{width: '48px', height: '62px'}} alt={record.GoodsName}/>
        },
        {
            title: '商品名称',
            dataIndex: 'GoodsName',
            key: 'GoodsName' ,
            render: (text, record, index) => <div>
                  <h3 style={{marginBottom: '0'}}>{record.GoodsName} </h3>
                  <span style={{ color: 'gray', fontSize: '12px'}}>{record.SpecName}</span>
                  <br />
                  <a>¥ <span style={{ fontSize: '16px'}}>{record.Price}</span></a>
                </div>
        },
        {
            title: '数量（件）',
            dataIndex: 'Number',
            key: 'Number',
            render: (text, record, index) => <span>x{text}</span>
        },
        ]
        let dataSource = []

        const formItemLayout = {
            labelCol: {
              xs: { span: 2 },
              sm: { span: 2 },
            },
            wrapperCol: {
              xs: { span: 22 },
              sm: { span: 22 },
            },
          };
          const arrivalTimeFormItemLayout = {
            labelCol: {
              xs: { span: 14 },
              sm: { span: 14 },
            },
            wrapperCol: {
              xs: { span: 10 },
              sm: { span: 10 },
            },
          }
        if (!!selectedRows.length) {
            selectedRows.forEach((goodsItem, goodsIndex) => {
                if(goodsItem) dataSource.push({ ...goodsItem, key: `selectedRows_${goodsItem.Id}` })
            })
        }
        return (

          <Modal
          zIndex={998}
            visible={visible}
            title="商品采购表单"
            okText="确认"
            cancelText="取消"
            onCancel={onCancel}
            onOk={onCreate}
          >
            <Form layout="vertical">
                <Form.Item label="仓库" {...formItemLayout}>
                {getFieldDecorator('companyName')(
                    <div style={{ textAlign: 'right'}}>
                        {
                            hasWarehouseSumList && warehouseSumList.map(warehouseSumItem => {
                                if (warehouseSumItem.CompanyId === userInfo.companyId) return <div key={warehouseSumItem.CompanyName}>{warehouseSumItem.CompanyName}</div>
                                return null
                            })
                        }
                    </div>
                )}
              </Form.Item>
              <Form.Item label="入库时间" {...arrivalTimeFormItemLayout}>
                {getFieldDecorator('arrivalTime', {
                  rules: [{ required: true, message: '请选择入库时间!' }],
                })(
                  <DatePicker style={{textAlign: 'right'}} locale={locale} showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </Form.Item>
              <Form.Item label="描述">
                {getFieldDecorator('desc')( <Input.TextArea rows={4} placeholder='请添加商品备注' />)}
              </Form.Item>
              <Form.Item label="商品清单">
                {getFieldDecorator('goodsLists')(
                  <Table
                      columns={columns}
                      dataSource={dataSource}
                      loading={loading}
                      showHeader={false}
                      pagination={false} /> 
                )}
              </Form.Item>
            </Form>
          </Modal>
        );
      }
    }
  );
  

  export default WarehouseAddCreateForm