import { Row, Col } from 'antd';
import WarehouseAddSelect from '../../components/WarehouseAddSelect'
import WarehouseAddDrawer from '../../components/WarehouseAddDrawer'
import WarehouseAddModal from '../../components/WarehouseAddModal'
import WarehouseAddTable from '../../components/WarehouseAddTable'
function Add () {
    return (
    <Row>
        <Col span={24}>
            <WarehouseAddSelect />
            <WarehouseAddDrawer />
            <WarehouseAddModal />
            <WarehouseAddTable />
        </Col>
    </Row>
    )
}


export default Add