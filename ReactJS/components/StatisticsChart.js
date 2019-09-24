import { Component } from 'react'
import { connect } from 'dva'
import { Chart, Geom, Axis, Tooltip, Coord, Label } from "bizcharts";
import { DataView } from "@antv/data-set";
import router from 'umi/router'

export default connect(state => (
   {
      userType: state.users.userInfo.userType,
      companyId: state.home.companyId,
      goodsId: state.statistics.goodsId,
      year: state.statistics.year,
      month: state.statistics.month,
      state: state.statistics.state,
      hasSaleStatistics: state.statistics.SaleStatistics,
      SaleStatistics: state.statistics.SaleStatistics,
      SaleStatisticsCode: state.statistics.SaleStatisticsCode,
      loading: state.loading.models.statistics
   }
))(class StatisticsChart extends Component {

  onPlotClick (ev) {
    let {
      userType,
      companyId,
      goodsId,
      year,
      month,
      state,
    } = this.props
    if (userType === 1 && companyId === 1) {
      return router.push(`/statistics/SaleStatisticsForMonth?goodsId=${goodsId}&year=${year}&month=${month}`)
    }
    return router.push(`/statistics/SellDetailStatisticsForMonth?companyId=${companyId}&year=${year}&month=${month}&goodsId=${goodsId}&state=${state}`)
  }
  render () {
    let {
        month,
        hasSaleStatistics,
        SaleStatistics,
    } = this.props

    let data = []

    if (hasSaleStatistics) {
        data = [{
          item: `${month}月份总销售（件）`, 
          count: SaleStatistics.monthSales.reduce((accumulator, currentValue) => accumulator + currentValue)
        }]
    }
    
    const dv = new DataView();
    dv.source(data).transform({
      type: "percent",
      field: "count",
      dimension: "item",
      as: "percent"
    });
    const cols = {
      percent: {
        formatter: val => {
          return val;
        }
      }
    };

    return <Chart
            onPlotClick={this.onPlotClick.bind(this)}
            height={300}
            data={dv}
            scale={cols}
            padding={[20, 20, 20, 20]}
          >
            <Coord type="theta" radius={0.75} />
            <Axis name="percent" />
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="item"
              tooltip={[
                "item*count",
                (item, conut) => {
                  return {
                    name: item,
                    value: conut
                  };
                }
              ]}
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            >
              <Label
                content="count"
                formatter={(val, item) => {
                  return item.point.item + ": " + val;
                }}
              />
            </Geom>
      </Chart>
  }
})