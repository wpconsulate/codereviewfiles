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
          type: 'login/LoginAccount',
          payload: values,
        });
      }
    });
  }
  return (
    <main>
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
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入管理员密码' }],
                  })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入管理员密码" />
                  )}
                </Form.Item>
                {/* <Form.Item> */}
                  <Row style={{marginBottom: '1rem'}}>
                   {/*  <Col span={12}>
                      {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(
                        <Checkbox>记住账号</Checkbox>
                      )}
                    </Col> */}
                    <Col span={24} style={{textAlign: 'right'}}>
                      <Link to="/forgot">忘记密码？</Link>
                    </Col>
                  </Row>
                {/* </Form.Item> */}
                <Form.Item>
                  <Button type="primary" htmlType="submit" block loading={loading}>
                    登录
                  </Button>
                </Form.Item>
              </Form>
              </Col>
            </Row>
          </Col>
        </Row>
    </main>
  );
}

function mapStateToProps(state) {
  return {
    ...state.login,
    loading: state.loading.models.login
  };
}

const WrappedLoginForm = Form.create()(LoginForm);

export default connect(mapStateToProps)(WrappedLoginForm)