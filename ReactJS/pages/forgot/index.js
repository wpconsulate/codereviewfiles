import { connect } from 'dva';
import { Row, Col, Form, Icon, Input, Button, Alert } from 'antd';
import Link from 'umi/link'
 

function LoginForm ({ dispatch, form, hasCode, codeType, codeText, loading }) {
  let { getFieldDecorator } = form;

  function handleSubmit (e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        dispatch({
          type: 'login/UpdatePasswordForget',
          payload: values,
        });
      }
    });
  }
  function handleForgotVCode () {
   let phone = form.getFieldValue('phone')
   if (!phone) {
    return form.setFields({
      phone: {
        errors: [new Error('请输入管理员账号')],
      },
    });
   }
    dispatch({
      type: 'login/SendForgetPasswordMessage',
      payload: {phone},
    });
  }
  return (<main>
      <Row>
        <Col span={24}>
        { hasCode ? <Alert type={codeType} message={codeText} banner /> : <div style={{height: '37px'}}></div> }
        </Col>
      </Row> 
      <Row type="flex" align="middle" justify="center" style={{padding: '8rem 0'}}>
        <Col xs={16} sm={10} md={8} lg={8} xl={6} xxl={6} style={{border: '1px solid #eee', padding: '1.8rem 1.8rem 0'}}>
          <Row>
            <Col >
              <Form onSubmit={handleSubmit}>
                <Form.Item>
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: '请输入管理员账号' }],
                  })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入管理员账号" />
                  )} 
                </Form.Item>
                <Form.Item>
                  <Row gutter={8} type="flex" justify="space-between">
                    <Col span={14}>
                      {getFieldDecorator('vcode', {
                        rules: [{ required: true, message: '请输入验证码'}, {max: 4,  message: '请输入4位验证码'}],
                      })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="text" placeholder="请输入密码" />
                      )}
                    </Col>
                    <Col span={10} style={{textAlign: 'right'}}>
                      <Button type="primary" block onClick={handleForgotVCode}>
                        发送验证码
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入管理员新密码' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入管理员新密码" />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    修改密码
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary">
                    <Link to='/login'><Icon type="left" />返回登录</Link>
                  </Button>
                </Form.Item>
              </Form>
              </Col>
            </Row>
          </Col>
        </Row>
    </main>);
}

function mapStateToProps(state) {
  return {
    ...state.login,
    loading: state.loading.models.login
  };
}

const WrappedLoginForm = Form.create()(LoginForm);

export default connect(mapStateToProps)(WrappedLoginForm)