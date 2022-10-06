<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称" :model="spu">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in TrademarkList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  
                      list-type: 文件列表的类型 
                      on-preview:图片预览的时候会触发
                      on-remove:当删除图片的时候会触发
                      file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
                      on-preview：图片预览功能
                      on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="SpuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${UNSelectSaleAttr.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in UNSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 5px"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示当前spu元素的销售属性 -->
        <el-table
          border
          style="width: 100%; margin-top: 5px"
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column
            label="属性名"
            width="180"
            prop="saleAttrName"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <!-- splice函数第一个值为删除元素的索引值，第二个为删除个数 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm" -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="{ row, $index }">
              <el-popconfirm title="这是一段内容确定删除吗？">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                  @click="spu.spuSaleAttrList.splice($index, 1)"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu信息属性
      //spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌信息
      TrademarkList: [],
      // 存储spu图片信息
      SpuImageList: [],
      // 存储销售属性数据
      SaleAttrList: [],
      // 收集未选择销售属性id
      attrIdAndName: "",
    };
  },
  methods: {
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.SpuImageList = fileList;
    },
    // 图片预览功能
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化spuform数据
    async InitSpuData(spu) {
      // 获取spu信息数据
      let res = await this.$API.spu.reqSpu(spu.id);
      if (res.code == 200) {
        //   修改spu向服务器发请求，把服务器返回数据（对象）赋值给spu属性
        this.spu = res.data;
      }
      //获取品牌下拉框信息
      let res1 = await this.$API.spu.reqTrademarkList();
      if (res1.code == 200) {
        this.TrademarkList = res1.data;
      }
      //获取spu图片
      let res2 = await this.$API.spu.reqSpuImageList(spu.id);
      if (res2.code == 200) {
        //   先处理在赋值
        let listArr = res2.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          (item.name = item.imgName), (item.url = item.imgUrl);
        });
        //把整理好的数据赋值给
        this.SpuImageList = listArr;
      }
      //获取销售属性下拉框
      let res3 = await this.$API.spu.reqBaseSaleAttrList();
      if (res.code == 200) {
        this.SaleAttrList = res3.data;
      }
    },
    //照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      //收集图片的信息
      this.SpuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr() {
      //已经收集需要添加的销售属性的信息
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      //向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndName = "";
    },
    // 属性值名称‘添加’按钮的回调
    addSaleAttrValue(row) {
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible（用$set），控制button与input切换
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    // el-input失却焦点的事件
    handleInputConfirm(row) {
      //解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      //属性值不能重复,这里也可以用some
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message("属性值不能重复");
        return;
      }
      //新增的销售属性值
      const newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      //新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //修改inputVisible为false，不就显示button
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spu.spuImageList = this.SpuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        // 通知父组件回到场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        });
        //清理数据
        Object.assign(this._data,this.$options.data())
      }
    },
    //点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      //添加SPU的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      //获取品牌下拉框信息
      let res1 = await this.$API.spu.reqTrademarkList();
      if (res1.code == 200) {
        this.TrademarkList = res1.data;
      }
      //获取销售属性下拉框
      let res3 = await this.$API.spu.reqBaseSaleAttrList();
      if (res3.code == 200) {
        this.SaleAttrList = res3.data;
      }
    },
    // 取消按钮
    cancel() {
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //   计算未选择的销售属性
    UNSelectSaleAttr() {
      //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
      //当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
      //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
      let res = this.SaleAttrList.filter((item) => {
        //every数组的方法，会返回一个布尔值【真，假的】
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      // console.log(res);
      return res;
    },
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
