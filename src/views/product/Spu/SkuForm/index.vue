<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="index"
            style="margin-bottom: 5px"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="index"
          >
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row, index }">
              <img :src="row.imgUrl" style="height: 100px; width: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, index }">
              <el-button size="mini" type="primary"  v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
               </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <template slot-scope='{row,index}'>
          <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 获取销售属性
      spuSaleAttrList: [],
      // 获取平台属性的数据
      attrInfoList: [],
      //收集sku数据
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集图片数据字段,缺失IDDefault,将来提交给服务器数据时要整理参数
      imageList:[],
    };
  },
  methods: {
    // 获取skuForm数据
    async getData(categroy1Id, categroy2Id, spu) {
      // 收集父组件数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片数据
      let res = await this.$API.spu.reqSpuImageLists(spu.id);
      if (res.code == 200) {
        let list=res.data
        list.forEach(item => {
          item.isDefault=0
        });
        this.spuImageList = list;
      }
      // 获取销售属性
      let res1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (res1.code == 200) {
        this.spuSaleAttrList = res1.data;
      }
      // 获取平台属性的数据
      let res2 = await this.$API.spu.reqAttrInfoList(
        categroy1Id,
        categroy2Id,
        spu.category3Id
      );
      if (res2.code == 200) {
        this.attrInfoList = res2.data;
      }
    },
    //复选框按钮时间 
    handleSelectionChange(params){
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
       this.imageList = params;
    },
    // 排他
    changeDefault(row){
      //图片列表的数据的isDefault字段变为 0
      this.spuImageList.forEach(item=>{
        item.isDefault=0
      })
       //点击的那个图片的数据变为1
      row.isDefault=1
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消
    cancel(){
      // 自定义事件，让父组件切换场景0
      this.$emit('changeScenes',0)
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // 保存
    async save(){
      //整理参数
      //整理平台属性
      const {attrInfoList,skuInfo,spuSaleAttrList,spuImageList}=this
      skuInfo.skuAttrValueList=attrInfoList.reduce((prev,item)=>{
        if(item.attrIdAndValue){
          const [attrId,valueId]=item.attrIdAndValue.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      //整理图片的数据
      skuInfo.skuImageList=spuImageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      },[])
      // 发请求
      let res=await this.$API.spu.reqAddSku(skuInfo)
      if(res.code==200){
        this.$emit('changeScenes',0)
        this.$message({
          type:'success',
          message:'添加sku成功'
        })
      }
    }
  },
};
</script>
<style scoped>
</style>