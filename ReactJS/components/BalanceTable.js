import  { connect } from 'dva'
import { Row, Col, Table, Empty } from 'antd';
import moment from '../utils/moment';

function BalanceTable (props) {
    let {
        loading,
        hasBalanceListForCompany,
        BalanceListForCompany,
        BalanceListForCompanyCode,
    } = props

    const title = () => <div>
        <Row>
            <Col span={12}>
                <span style={{ marginRight: '20px' }}>本月总支出：<a>{BalanceListForCompany.expend.toFixed(2)}</a></span>
                <span style={{ marginRight: '20px' }}>本月总收入：<a>{BalanceListForCompany.income.toFixed(2)}</a></span>
            </Col>
            <Col span={12} style={{ textAlign: 'right'}}>
                <span>余额（元）：<a>{BalanceListForCompany.balance.Balance.toFixed(2)}</a></span>
            </Col>
        </Row>
    </div>

    const columns = [
        {
            title: '日期',
            dataIndex: 'CreateTime',
            key: 'CreateTime',
            render: (text, record, index) => <span>{moment.unix(text).format('MM月DD日HH:mm')}</span>
        },
        {
            title: '操作',
            dataIndex: 'OpType',
            key: 'OpType',
            render: (text, record, index) => {
                if (text === 1) return <span>进货付款</span>
                if (text === 2) return <span>总部充值</span>
                if (text === 3) return <span>管理员调控</span>
            }
        },
        {
            title: '金额（元）',
            dataIndex: 'Amount',
            key: 'Amount',
            render: (text, record, index) => <span>{text.toFixed(2)}</span>
        }
    ]
    
    let dataSource = []
    if (hasBalanceListForCompany && BalanceListForCompany.balanceOpList) {
        dataSource = BalanceListForCompany.balanceOpList.map(item => ({ ...item, key: `BalanceListForCompany_${item.BalanceOpId}`}))
    }

    return (
        hasBalanceListForCompany ? 
        <Table title={title} loading={loading} pagination={false} columns={columns} dataSource={hasBalanceListForCompany ? dataSource : null} />
        :
        <Empty style={{margin: '4rem'}} description={BalanceListForCompanyCode} />
    )
}


function mapStateToProps (state) {
    return {
        ...state.balance,
        loading: state.loading.models.balance,
    }
}

export default connect(mapStateToProps)(BalanceTable)