import * as warehouseService from '../services/warehouse';
import { message } from 'antd';

export default {

    namespace: 'warehouse',
  
    state: {
        
        // 获得仓库总数列表
        hasWarehouseSumList: false,
        WarehouseSumList: null,
        WarehouseSumListCode: '',
        // 获得单个仓库详情
        hasWarehouseDetail: false,
        WarehouseDetail: null,
        WarehouseDetailCode: '',
        // 获得仓库单个商品详情
        hasWarehouseGoodsDetail: false,
        WarehouseGoodsDetail: null,
        WarehouseGoodsDetailCode: '',
        // 获得库存历史
        StockHistoryLimit: 0,
        hasStockHistory: false,
        StockHistory: null,
        StockHistoryCode: '',
        // 获得库存历史详情
        hasStockHistoryDetail: false,
        StockHistoryDetail: null,
        StockHistoryDetailCode: '',
        // // 获取商品规格
        // hasGoodsSpecMaterialList: false,
        // goodsSpecMaterialList: null,
        // goodsSpecMaterialListCode: '',
        // 获取公司余额
        hasCompanyBalance: false,
        CompanyBalance: null,
        CompanyBalanceCode: '',
        // 获取商品规格
        companyId: 0,
        goodsId: 0,
        specIds: null,
        specId: null,
        number: 1,
        GoodsSpecVisible: false,
        hasGoodsSpecMaterialList: false,
        GoodsSpecMaterialList: null,
        GoodsSpecMaterialListCode: '',
        hasGoodsSpec: false,
        GoodsSpec: null,
        GoodsSpecCode: '',
        // 获得本地数据
        hasGoodsSpeclocalStorage: false,
        GoodsSpeclocalStorage: null,
        GoodsSpeclocalStorageCode: '',
        // 获得本地数据
        hasGoodsCartMaterialList: false,
        goodsCartMaterialList: [],
        goodsCartToTableCode: '',
        // xx
        selectedRowKeys: [],
        selectedRows: [],
        goodsCarts: [],
        visible: false,
        totalNumber: 0,
        totalPrice: 0,
        WarehouseAddPayPassWordVisible: false,
        // 获取调货数据列表
        status: '0',
        ApprovalAdjustmentPass0Visible: false,
        ApprovalAdjustmentPass1Visible: false,
        CancelAdjustmentVisible: false,
        adjustmentId: 0,
        pass: 0,
        reason: '',
        hasAdjustmentList: false, 
        AdjustmentList: null, 
        AdjustmentListCode: '',
       
    },
  
    subscriptions: {
        setup({ dispatch, history }) {
          return history.listen(async ({ pathname, query }) => {
            if (pathname.includes('warehouse')) {

              const result = await dispatch({ type: 'users/GetLocalStorage' })
              if (!result) {
                history.push('/login')
              }

              await dispatch({ type: 'home/GetHomeData' })

              if (pathname === '/warehouse') {
                await dispatch({ type: 'GetWarehouseSumList' })
              }

              if (pathname === '/warehouse/WarehouseDetail') {
                let { companyId } = query
                await dispatch({ type: 'GetWarehouseDetail', payload: { companyId } })
              }

              if (pathname === '/warehouse/AdjustmentList') {
                let { companyId, status } = query
                dispatch({ type: 'save', payload: { status } })
                await dispatch({ type: 'GetAdjustmentList',  payload: { companyId, status } })
              }

              if (pathname === '/warehouse/WarehouseGoodsDetail') {
                let { companyId, goodsId } = query
                await dispatch({ type: 'GetWarehouseGoodsDetail', payload: { companyId, goodsId } })
              }

              if (pathname === '/warehouse/GoodsSpec') {
                let { companyId, goodsId, specId } = query
                specId = specId ? specId.split(',').map(item => Number(item)) : null
                await dispatch({ type: 'GetGoodsSpeclocalStorage', payload: { companyId, goodsId, specId } })
                if (specId) {
                  await dispatch({ type: 'GetGoodsSpec', payload: { companyId, goodsId, specId } })
                }
                
              }

              if (pathname === '/warehouse/StockHistory' ) {
                let { companyId, year, month } = query
                await dispatch({ type: 'GetStockHistory', payload: { companyId, year, month } })
              }

              if (pathname ===  '/warehouse/StockHistoryDetail') {
                let { companyId, time } = query
                await dispatch({ type: 'GetStockHistoryDetail', payload: { companyId, time } })
              }
              
            }
          })
        },
    },
  
    effects: {
      // 添加调货
      *AddAdjustment({ payload : { companyId, goodsId, payPassword, specId, specName, number, arrivalTime, desc } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { ret, code }} = yield call(warehouseService.AddAdjustment, { 
          body: { 
            userId, 
            companyId, 
            goodsId, 
            payPassword, 
            specId, 
            specName, 
            number, 
            arrivalTime, 
            desc 
          },
            headers: { 
              Authorization: JwtToken 
            } 
          })
        if (ret === 1001) {
          yield message.success(code)
          yield({ type: 'save', payload: { visible: false, WarehouseAddPayPassWordVisible: false, selectedRowKeys: [], selectedRows: [], hasGoodsCartMaterialList: false, goodsCartMaterialList: [] }})
          localStorage.removeItem(`goodsCartMaterialList_${goodsId}`)
          return true
        }
        if (ret === 1002) {
          message.warning(code)
          return false
        }
      },
      // 审批调货数据（必须超管）
      *ApprovalAdjustment({ payload: { adjustmentId, pass, reason }}, { call, put, select }) {
        const { companyId } = yield select(state => state.home)
        const { status } = yield select(state => state.warehouse)
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { ret, code }} = yield call(warehouseService.ApprovalAdjustment, { 
          body: { 
            userId,
            adjustmentId,
            pass,
            reason,
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        if (ret === 1001) {
          yield message.success(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return true
        }
        if (ret === 1002) {
          yield message.warn(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return false
        }
      },
      // 取消调货数据
      *CancelAdjustment({ payload: { adjustmentId, reason } }, { call, put, select }) {
        const { companyId } = yield select(state => state.home)
        const { status } = yield select(state => state.warehouse)
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { ret, code }} = yield call(warehouseService.CancelAdjustment, { 
          body: { 
            userId,
            adjustmentId,
            reason,
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        if (ret === 1001) {
          yield message.success(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return true
        }
        if (ret === 1002) {
          yield message.warn(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return false
        }
      },
      // 调货完成调货数据（必须超管）
      *FinishAdjustment({ payload: { adjustmentId } }, { call, put, select }) {
        const { companyId } = yield select(state => state.home)
        const { status } = yield select(state => state.warehouse)
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { ret, code }} = yield call(warehouseService.FinishAdjustment, { 
          body: { 
            userId,
            adjustmentId,
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        if (ret === 1001) {
          yield message.success(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return true
        }
        if (ret === 1002) {
          yield message.warn(code)
          yield put({ type: 'GetAdjustmentList', payload: { companyId, status } })
          return false
        }
      },
      // 获取调货数据列表
      *GetAdjustmentList({ payload: { companyId, status } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code }} = yield call(warehouseService.GetAdjustmentList, { 
          body: { 
            userId,
            companyId,
            status
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasAdjustmentList: true, 
              AdjustmentList: data, 
              AdjustmentListCode: '' 
            } 
          })
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasAdjustmentList: false, 
              AdjustmentList: null, 
              AdjustmentListCode: code 
            } 
          })
          return false
        }
      },
      // 获取公司余额
      *GetCompanyBalance({ payload: { companyId } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(warehouseService.GetCompanyBalance, { 
          body: { 
            userId, 
            companyId,
          }, 
            headers: { 
              Authorization: JwtToken 
            } 
          })
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasCompanyBalance: true, 
              CompanyBalance: data,
              CompanyBalanceCode: ''
            } 
          });
          return data
        } 
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasCompanyBalance: false, 
              CompanyBalance: null, 
              CompanyBalanceCode: code 
            } 
          });
          return false
        }
      },
      // 获取商品规格
      *GetGoodsSpec({ payload : { companyId, goodsId, specId } }, { call, put, select }) {
        const { JwtToken, userId, } = yield select(state => state.users.userInfo)
        const { data } = yield call(warehouseService.GetGoodsSpec, { 
          body: { 
            userId, 
            companyId, 
            goodsId 
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        const { ret, code } = data
        if (ret === 1001) {
          let specIds
          if (specId) {
            specIds = data.materialList.map(item => item.SpecId === specId.join(',') && item.SpecId.split(',').map(item => Number(item))).filter(item => item)
          } else {
            specIds = data.materialList.map(item => item.SpecId.split(',').map(item => Number(item)))
          }
          yield put({ 
            type: 'save', 
            payload: { 
              specIds,
              specId,
              GoodsSpecVisible: true,
              hasGoodsSpec: true, 
              GoodsSpec: data,
              GoodsSpecCode: '',
            }
          });
          if (specId && specId.filter(item => item).length === data.specDatas.length) {
            let GoodsSpecMaterialList = data.materialList.filter(item => item.SpecId === specId.join(',') && item)
            yield put({ 
              type: 'save', 
              payload: { 
                hasGoodsSpecMaterialList: true, 
                GoodsSpecMaterialList 
              } 
            })
        }
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasGoodsSpec: false, 
              GoodsSpec: null, 
              GoodsSpecCode: code 
            } 
          });
          return false
        }
      },
      // 获取本地商品规格 
      *GetGoodsSpeclocalStorage({ payload: { companyId, goodsId, specId } }, { call, put, select }) {
        const { userId } = yield select(state => state.users.userInfo)
        const result = localStorage.getItem(`GoodsSpeclocalStorage_${userId}_${companyId}_${goodsId}`)
        if (result) {
          yield put({
            type: 'save',
            payload: {
              companyId,
              goodsId,
              hasGoodsSpeclocalStorage: true,
              GoodsSpeclocalStorage: JSON.parse(result),
              GoodsSpeclocalStorageCode: '',
            }
          })
          return true
        }
        if (!result) {
          yield put({
            type: 'save',
            payload: {
              companyId,
              goodsId,
              specId,
              hasGoodsSpeclocalStorage: false,
              GoodsSpeclocalStorage: null,
              GoodsSpeclocalStorageCode: '无商品',
            }
          })
          return false
        }
      },
      // 更新本地商品规格 
      *UpdateGoodsSpeclocalStorage({ payload }, { call, put, select }) {
        

      },
      // 删除本地商品规格
      *RemoveGoodsSpeclocalStorage({ payload }, { call, put, select }) {
        

      },
      // 获得库存历史
      *GetStockHistory({ payload : { companyId, year, month } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(warehouseService.GetStockHistory, { 
          body: { 
            userId, 
            companyId, 
            year, 
            month 
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        const { ret, code } = data
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasStockHistory: true, 
              StockHistory: data, 
              StockHistoryCode: '' 
            } 
          })
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasStockHistory: false, 
              StockHistory: null, 
              StockHistoryCode: code 
            } 
          })
          return false
        }
      },
      // 获得库存历史详情
      *GetStockHistoryDetail({ payload: { companyId, time } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(warehouseService.GetStockHistoryDetail, { 
          body: { 
            userId, 
            companyId, 
            time
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        });
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasStockHistoryDetail: true, 
              StockHistoryDetail: data, 
              StockHistoryDetailCode: '' 
            } 
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save',
            payload: { 
              hasStockHistoryDetail: false, 
              StockHistoryDetail: null, 
              StockHistoryDetailCode: code 
            } 
          });
          return false
        }
      },
      // 获得仓库单个商品详情
      *GetWarehouseGoodsDetail({ payload: { companyId, goodsId } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(warehouseService.GetWarehouseGoodsDetail, { 
          body: { 
            userId, 
            companyId, 
            goodsId 
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        })
        const { ret, code } = data
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              goodsId,
              hasWarehouseGoodsDetail: true, 
              WarehouseGoodsDetail: data, 
              WarehouseGoodsDetailCode: '' 
            } 
          });
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              goodsId: 0,
              hasWarehouseGoodsDetail: false, 
              WarehouseGoodsDetail: null, 
              WarehouseGoodsDetailCode: code 
            } 
          });
          return false
        }
      },
      // 获得单个仓库详情
      *GetWarehouseDetail({ payload }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data } = yield call(warehouseService.GetWarehouseDetail, { 
          body: { 
            userId, 
            companyId: payload.companyId 
        }, 
          headers: { 
            Authorization: JwtToken 
          } 
        })
        const { ret, code } = data
        if (ret === 1001) {
          yield put({ 
            type: 'save',
            payload: {
              hasWarehouseDetail: true,
              WarehouseDetail: data,
              WarehouseDetailCode: code
            } 
          })
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save',
            payload: { 
              hasWarehouseDetail: false,
              WarehouseDetail: null,
              WarehouseDetailCode: code 
            }
          })
        }
        return data
      },
      // 搜索仓库总数列表（用户必须是超管）
      *SearchWarehouseSumList({ payload: { where } }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(warehouseService.SearchWarehouseSumList, { 
          body: { 
            userId,
            where
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        })
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasWarehouseSumList: true, 
              WarehouseSumList: data,
              WarehouseSumListCode: ''
            } 
          })
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasWarehouseSumList: false, 
              WarehouseSumList: null, 
              WarehouseSumListCode: code 
            } 
          })
          return false
        }
      },
      // 获得仓库总数列表
      *GetWarehouseSumList({ payload }, { call, put, select }) {
        const { JwtToken, userId } = yield select(state => state.users.userInfo)
        const { data: { data, ret, code } } = yield call(warehouseService.GetWarehouseSumList, { 
          body: { 
            userId
          }, 
          headers: { 
            Authorization: JwtToken 
          } 
        })
        if (ret === 1001) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasWarehouseSumList: true, 
              WarehouseSumList: data,
              WarehouseSumListCode: ''
            } 
          })
          return data
        }
        if (ret === 1002) {
          yield put({ 
            type: 'save', 
            payload: { 
              hasWarehouseSumList: false, 
              WarehouseSumList: null, 
              WarehouseSumListCode: code 
            } 
          })
          return false
        }
      },
      // *SetGoodsCarts({ payload }, { call, put, select }) {
      //   if (payload) {
      //     let [index, value] = payload.split(',').map(item => Number(item))
      //     // console.log(index, value)
      //     let { goodsCarts } = yield select(state => state.warehouse)
      //     goodsCarts[index] = value
      //     yield put({ type: 'save', payload: { goodsCarts } })
      //   } else {
      //     const { goodsId } = yield select(state => state.warehouse)
      //     yield put({ type: 'GetGoodsSpec', payload: { goodsId } })
      //   }
      // },
      // *saveGoodsCartMaterialList({ payload }, { call, put, select }) {
      //   let { goodsId, number, goodsCartMaterialList, goodsCarts, goodsSpecMaterialList } = yield select(state => state.warehouse)
      //   // console.log(goodsCartMaterialList)
      //   let result = goodsSpecMaterialList.materialList.map(materialItem => materialItem.SpecId)
      //   let goodsCartsString = goodsCarts.join(',')
      //   if (result.includes(goodsCartsString)) {
      //     let index = goodsSpecMaterialList.materialList.findIndex(materialItem => materialItem.SpecId === goodsCartsString)
      //     if (!goodsCartMaterialList[index]) {
      //       goodsCartMaterialList[index] = Object.assign({}, goodsSpecMaterialList.materialList[index])
      //     }
      //     if (goodsCartMaterialList[index].Number) {
      //       goodsCartMaterialList[index].Number += number
      //     } else {
      //       goodsCartMaterialList[index].Number = number
      //     }
      //     localStorage.setItem(`goodsCartMaterialList_${goodsId}`, JSON.stringify(goodsCartMaterialList))
      //     yield put({ type: 'save', payload: { hasGoodsCartMaterialList: true, goodsCartMaterialList }})
      //     message.success('添加成功');
      //   } else {
      //     message.warning('无此规格，请重新选择');
      //   }
      // },
      // *setGoodsCartMaterialList ({ payload: { text, record, index, value } }, { call, put, select }) {
      //   let { goodsId, goodsCartMaterialList } = yield select(state => state.warehouse)
      //   record.Number = value
      //   goodsCartMaterialList[index] = record
      //   localStorage.setItem(`goodsCartMaterialList_${goodsId}`, JSON.stringify(goodsCartMaterialList))
      //   yield put({ type: 'save', payload: { goodsCartMaterialList } })
      // },
      // *add({ payload: { goodsId } }, { call, put, select }) {
      //   yield put({ type: 'save', payload: { goodsId, selectedRowKeys: [], selectedRows: [] } })
      //   let goodsCartMaterialList = JSON.parse(localStorage.getItem(`goodsCartMaterialList_${goodsId}`))
      //   if (goodsCartMaterialList) {
      //     yield put({ type: 'save', payload: { hasGoodsCartMaterialList: true, goodsCartMaterialList } })
      //   } else {
      //     yield put({ type: 'save', payload: { hasGoodsCartMaterialList: false, goodsCartMaterialList: [] } })
      //   }
      // },
      // *remove({ payload: { text, record, index } }, { call, put, select }) {
      //   let { goodsCartMaterialList } = yield select(state => state.warehouse)
      //   goodsCartMaterialList.splice(index, index + 1)
      //   if (!!goodsCartMaterialList.length) {
      //     localStorage.setItem(`goodsCartMaterialList_${record.GoodsId}`, JSON.stringify(goodsCartMaterialList))
      //     yield put({ type: 'save', payload: { hasGoodsCartMaterialList: true, goodsCartMaterialList } })
      //   } else {
      //     yield put({ type: 'save', payload: { hasGoodsCartMaterialList: false, goodsCartMaterialList: [] } })
      //     localStorage.removeItem(`goodsCartMaterialList_${record.GoodsId}`)
      //   }
      // }
    },
  
    reducers: {
        save(state, action) {
          return { ...state, ...action.payload };
        }
    },
  
  };
  
  