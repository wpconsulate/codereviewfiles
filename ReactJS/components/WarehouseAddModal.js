import React from 'react'
import  { connect } from 'dva'
import WarehouseAddCreateForm from './WarehouseAddCreateForm'
import WarehouseAddPayPassWord from './WarehouseAddPayPassWord'

class WarehouseAddModal extends React.Component {
    state = {
      values: null,
      form: null
    }
    handleCancel = () => {
        this.props.dispatch({ type: 'warehouse/save', payload: { visible: false }})
    }
  
    handleCreate = (e) => {
      e.preventDefault();

      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        this.setState({
          values,
          form
        }, () => {
          this.props.dispatch({ type: 'warehouse/GetCompanyBalance' })
          this.props.dispatch({ type: 'warehouse/save', payload: { WarehouseAddPayPassWordVisible: true }})
        })
      });
    }
  
    saveFormRef = (formRef) => {
      this.formRef = formRef;
    }
  
    render() {
      return (
        <div>
          <WarehouseAddCreateForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.props.visible}
            userInfo={this.props.userInfo}
            hasWarehouseSumList={this.props.hasWarehouseSumList}
            warehouseSumList={this.props.warehouseSumList}
            selectedRows={this.props.selectedRows}
            loading={this.props.loading}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <WarehouseAddPayPassWord 
            values={this.state.values}
            WarehouseAddCreateFormRef={this.state.form}
            />
        </div>
      );
    }
  }


function mapStateToProps (state) {
    return {
        ...state.warehouse,
        ...state.users,
        loading: state.loading.models.warehouse,
    }
}

export default connect(mapStateToProps)(WarehouseAddModal)