import { Component } from 'react'
import { connect } from 'dva'
import { Select } from 'antd'
import router from 'umi/router'

export default connect(state => (
    {
        ...state.home,
        loading: state.loading.models.home
    }
))(class RootCompanySelect extends Component {
    componentWillUnmount() {
        this.props.dispatch({ type: 'home/save', payload: {
                company: '',
                companyId: 0,
                companyName: '',
                hasHomeData: false,
                HomeData: null,
                HomeDataCode: '',
            } 
        })
    }
    async onChange (value) {
        if (!value) {
            return
        }
        let {
            dispatch,
        } = this.props
        const [ companyId, companyName ] = value.split(',')
        await dispatch({ type: 'home/save', payload: { company: value, companyId: Number(companyId), companyName } })
        router.push('/')
    }
    render () {
        let {
            loading,
            company,
            hasHomeData,
            HomeData,
        } = this.props
        
        return  hasHomeData && <Select defaultValue={company} onChange={this.onChange.bind(this)} loading={loading} style={{ width: 180, ...this.props.style }}>
        {
            HomeData.CompanyList.map(item => <Select.Option key={item.CompanyId} value={`${item.CompanyId},${item.CompanyName}`}>{item.CompanyName}</Select.Option>)
        }
        </Select>
    }
}
)