import  { connect } from 'dva'
import { DatePicker } from 'antd';
import moment, { year, month, monthFormat} from '../utils/moment';

function BalanceDatePicker (props) {
    function onChange(date, dateString) {
        let [ year, month ] = dateString.split('-')
        props.dispatch({ type: 'balance/GetBalanceListForCompany', payload: { year, month }})
    }
    return <DatePicker.MonthPicker 
        onChange={onChange}
        placeholder="请选择月份" 
        defaultValue={moment(`${year}-${month}`, monthFormat)} format={monthFormat} />
}


function mapStateToProps (state) {
    return {
        ...state.balance,
        loading: state.loading.models.balance,
    }
}

export default connect(mapStateToProps)(BalanceDatePicker)