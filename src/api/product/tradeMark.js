// 获取品牌管理的数据模块
import request from '@/utils/request'
// 获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 处理添加品牌
// /admin/product/baseTrademark/save post 参数：品牌名称(tmName)，品牌logo(logoUrl)
// 不用传id，id由服务器生成

// 处理修改品牌
// /admin/product/baseTrademark/update put 参数：id，品牌名称(tmName)，品牌logo(logoUrl)
// 注：修改某品牌操作要带id，告诉服务器修改哪个品牌
export const reqAddOrUpdateTradeMark = (trademark) => {
  if (trademark.id) {
    // 修改
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: trademark
    })
  } else {
    // 添加
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: trademark
    })
  }
}
// 删除品牌
// /admin/product/baseTrademark/remove/{id} delete 参数id
export const reqDeleteTrademark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
