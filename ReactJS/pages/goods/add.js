import { Component } from 'react'
import { connect } from 'dva';
import {
  Form, Input, Row, Col, Checkbox, Button, Table, // Upload, Message, Icon,
} from 'antd';

/**
 *
 *
 * @class AddGoods
 * @extends {Component}
 */
class AddGoods extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectGoodSpecLists: [],
      dataSource: [],
      columns: []
    }
  }
  /**
   *
   *
   * @param {*} e
   * @memberof AddGoods
   */
  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(err)
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  
  /**
   *
   *
   * @param {*} goodSpec
   * @param {*} goodSpecIndex
   * @param {*} selectFudata
   * @memberof AddGoods
   */
  handleChange (goodSpec, goodSpecIndex, selectFudata) {
    // console.log('handleChange', goodSpec, goodSpecIndex, selectFudata)
    delete goodSpec.Fudata
    goodSpec.Fudata = selectFudata
    if (selectFudata.length) {
      let selectGoodSpecLists = Object.assign([], this.state.selectGoodSpecLists )
      selectGoodSpecLists[goodSpecIndex] = goodSpec
      this.setState({
        selectGoodSpecLists
      })
    } else {
      let selectGoodSpecLists = Object.assign([], this.state.selectGoodSpecLists )
      selectGoodSpecLists[goodSpecIndex] = null
      this.setState({
        selectGoodSpecLists
      })
    }
  
  }
  
  /**
   *
   *
   * @returns
   * @memberof AddGoods
   */
  render() {
    const { getFieldDecorator } = this.props.form;
    const { hasGoodSpecLists, goodSpecLists } = this.props
    let { selectGoodSpecLists } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    let filterGoodSpecLists = selectGoodSpecLists.filter(g => g)

    let dataSource = []
    filterGoodSpecLists
    // .sort((a, b) => {
    //   let aLength = a.Fudata.length
    //   let bLength = b.Fudata.length
    //   if (aLength > bLength ) {           // 按某种排序标准进行比较, a 小于 b
    //     return -1;
    //   }
    //   if (aLength < bLength ) {
    //     return 1;
    //   }
    //   // a must be equal to b
    //   return 0;
    // })
    .forEach((goodSpec, goodSpecIndex, currentGoodSpecLists) => {
      
      
      let nextGoodSpec = currentGoodSpecLists[goodSpecIndex + 1]
      if (nextGoodSpec) {
        // for (let i = 0; i < goodSpec.Fudata.length * nextGoodSpec.Fudata.length; i++) {
        //   const dataSourceIndex = dataSource.findIndex(dataItem => dataItem.key === i)
        //   if (~dataSourceIndex) {

        //   } else {
        //     console.log(dataSource)
        //     dataSource.push(...goodSpec.Fudata.map((fuData, fuDataIndex) => ({ key: i, [`${goodSpec.Id}_goodSpec`]: fuData})))
        //   }
        // }
      } else {
        dataSource.push(...goodSpec.Fudata.map((fuData, fuDataIndex) => ({ key: fuDataIndex, [`${goodSpec.Id}_goodSpec`]: fuData})))
      }
    })
    console.log('dataSource', dataSource)
    // const dataSource = [{
    //   key: '1',
    //   name: '胡彦斌',
    //   age: 32,
    //   address: '西湖区湖底公园1号'
    // }];

    // const columns = [{
    //   title: '姓名',
    //   dataIndex: 'name',
    //   key: 'name',
    // }];

    const rest = [
      {
        title: '原价格',
        dataIndex: 'price',
      },
      {
        title: '现价格',
        dataIndex: 'sprice',
      },
      {
        title: '图片上传',
        dataIndex: 'img',
      },
      {
        title: '图片预览',
        dataIndex: 'preview',
      }
    ]
  
    const columns = filterGoodSpecLists.map((goodSpec, goodsSpecIndex, cuurentGoodSpecLists) => {
      return {
        title: goodSpec.Name,
        dataIndex: `${goodSpec.Id}_goodSpec`,
        key: goodsSpecIndex,
        render: (values, record, index) => {
          // console.log('render', values, record, index)
          const obj = {
            children: values.Name,
            props: {},
          };
          return obj
        },
      }
    }).filter(goodSpec => goodSpec).concat(rest)
    // console.log('columns', columns)
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Item
          {...formItemLayout}
          label="商品名称"
        >
        {getFieldDecorator('name', {
                rules: [{ required: true, message: '输入商品名称' }],
              })(
                <Input placeholder="输入商品名称" />
              )} 
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="商品描述"
        >
          {getFieldDecorator('intr', {
            rules: [{ required: false, message: '输入商品描述' }],
          })(<Input.TextArea placeholder="输入商品描述" />)} 
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="商品详情"
        >
          {getFieldDecorator('detail', {
            rules: [{ required: true, message: '输入商品详情' }],
          })(<Input.TextArea placeholder="输入商品详情" />)} 
        </Form.Item>
        {
          hasGoodSpecLists && goodSpecLists.map((goodSpec, index) => 
            <Form.Item
              {...formItemLayout}
              label={goodSpec.Name}
              key={`${goodSpec.Id}_goodSpec`}
            > 
              {getFieldDecorator(`${goodSpec.Id}_goodSpec_${goodSpec.Name}`, {
              })(<Checkbox.Group style={{ width: '100%' }} onChange={this.handleChange.bind(this, Object.assign({}, goodSpec), index)}>
              <Row>
                {
                  goodSpec.Fudata.map(data =>
                    <Col key={`${data.Id}_fuData_${data.Name}`} span={6}><Checkbox value={data}>{data.Name}</Checkbox></Col>
                  )
                }
              </Row>
            </Checkbox.Group>)
              } 
            </Form.Item> 
          )
        }
        <Form.Item
           {...formItemLayout}
        >
        {
          !!filterGoodSpecLists.length && <Table dataSource={dataSource} columns={columns} pagination={false} />
        }
        </Form.Item>
        <Form.Item
           {...formItemLayout}
        >
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    );
  }
}

/**
 *
 *
 * @param {*} state
 * @returns
 */
function mapStateToProps(state) {
  return {
    ...state.goods,
    loading: state.loading.models.users
  };
}

const WrappedAddGoods = Form.create({
} )(AddGoods);

export default connect(mapStateToProps)(WrappedAddGoods)