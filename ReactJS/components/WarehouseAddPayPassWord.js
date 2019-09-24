import { connect } from 'dva'
import { Modal, Input, Form } from 'antd'


const WarehouseAddPayPassWord = Form.create({ name: 'WarehouseAddPayPassWord' })(
function WarehouseAddPayPassWordInner (props) {
    let { 
        form,
        dispatch,
        goodsId,
        selectedRows,
        WarehouseAddPayPassWordVisible,
        hasCompanyBalance,
        CompanyBalance
    } = props
    const { getFieldDecorator } = form;
    function onCancel (e) {
        dispatch({ type: 'warehouse/save', payload: { WarehouseAddPayPassWordVisible: false }})
    }
    function onOK (e) {
        e.preventDefault();
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          let { payPassword } = values
          let specId = selectedRows.map(item => item.SpecId).join('##'),
            specName = selectedRows.map(item => item.SpecName).join('##'),
            number = selectedRows.map(item => item.Number).join('##'),
            arrivalTime = props.values.arrivalTime.unix(),
            desc = props.values.desc || ''
          dispatch({ type: 'warehouse/AddAdjustment', payload: { goodsId, payPassword, specId, specName, number, arrivalTime, desc }})
        });
    }
    return (
        <Modal
        zIndex={999}
          title="请输入支付密码"
          visible={WarehouseAddPayPassWordVisible}
          okText="确认"
          cancelText="取消"
          onOk={onOK}
          onCancel={onCancel}
        >
            {
                hasCompanyBalance && <div>
                    <h3>
                        <a>
                        订单总计：
                        {
                            !!selectedRows.length ? selectedRows.map(item => item.Number * item.Price).reduce((accumulator, currentValue) => accumulator + currentValue) : 0
                        } 
                        </a>
                    </h3>
                    <p>账户余额：{CompanyBalance.Balance}</p>
                    <p>付款方式：在线支付</p>
                    <Form layout="vertical">
                    <Form.Item label="">
                        {getFieldDecorator('payPassword', {
                            rules: [{ required: true, message: '请输入支付密码' },
                                    { max: 6, min: 6, message: '请输入正确的6位支付密码' }],
                        })(
                        <Input placeholder='请输入支付密码' type="password" />
                        )}
                    </Form.Item>
                    </Form>
                </div>
            }
            
        </Modal>
    )
})

function mapStateToProps (state) {
    return {
        ...state.warehouse,
        loading: state.loading.models.warehouse,
    }
}


export default connect(mapStateToProps)(WarehouseAddPayPassWord)
