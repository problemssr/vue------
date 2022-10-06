<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动是全局组件了 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!categroy3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称"></el-table-column>
          <el-table-column prop="description" label="spu描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 使用hintButton切换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部列表"
                style="margin-right: 10px"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--  分页器 -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="  prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>

      <!-- 查看sku的对话框 -->
      <el-dialog
        :title="`${spu.spuName}的sku列表`"
        :visible.sync="dialogTableVisible"
      >
        <!-- 展示sku列表 -->
        <el-table :data="skuList" border v-loading="loading" :before-close="close">
          <el-table-column label="名称" prop="skuName"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="重量" prop="weight"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{ row, index }"> 
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
// 引入子组件 ----注册
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      categroy1Id: "",
      categroy2Id: "",
      categroy3Id: "",
      // 展示三级联动
      show: true,
      // 条数
      limit: 3,
      // 当前页
      page: 2,
      // spu列表数据
      records: [],
      // 总页数
      total: 0,
      // 0：spu列表数据 1：添加spu|修改spu 2：添加sku
      scene: 0,
      // 控制对话框显示与隐藏
      dialogTableVisible: false,
      spu: {},
      //存储的是SKU列表的数据
      skuList: [],
      loading: true,
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    // 三级联动自定义事件，将子组件相应id传给父组件
    getCategoryId({ categoryid, level }) {
      if (level == 1) {
        this.categroy1Id = categoryid;
        // 清除数据
        this.categroy2Id = "";
        this.categroy3Id = "";
      } else if (level == 2) {
        this.categroy2Id = categoryid;
        // 清除数据
        this.categroy3Id = "";
      } else {
        this.categroy3Id = categoryid;
        // 展示三级联动数据
        this.getSpuList();
      }
    },
    // 获取spu列表数据
    async getSpuList(pages = 1) {
      // 切换分页器当前页的回调
      this.page = pages;
      const { limit, page, categroy3Id } = this;
      // 带参page limit category3Id
      let res = await this.$API.spu.reqSpuList(page, limit, categroy3Id);
      if (res.code == 200) {
        this.records = res.data.records;
        this.total = res.data.total;
      }
    },
    // 切换条数的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件spuform发请求---品牌，销售属性
      this.$refs.spu.addSpuData(this.categroy3Id);
    },
    // 修改某个spu
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件spuform(拿子组件方法InitSpuData)
      ////////////在父组件可以通过$refs获取子组件，children也可
      this.$refs.spu.InitSpuData(row);
    },
    // 切换场景自定义事件回调
    changeScene({ scene, flag }) {
      // flag区分是添加还是修改
      this.scene = scene;
      // 子组件通知父组件切换场景，还需再次获取spu列表
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除某个spu
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if (res.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        if (this.records.length > 1) {
          this.getSpuList(this.page);
        } else {
          this.getSpuList(this.page - 1);
        }
      }
    },
    // 添加sku
    addSku(row) {
      // 切换场景2
      this.scene = 2;
      // 父组件调用子组件方法，让子组件发请求---3个parmas
      this.$refs.sku.getData(this.categroy1Id, this.categroy2Id, row);
    },
    //skuform通知父组件切换场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku按钮的回调
    async handler(spu) {
      //点击这个按钮的时候，对话框可见的
      this.dialogTableVisible = true;
      //保存spu信息
      this.spu = spu;
      //获取sku列表的数据进行展示
      let res = await this.$API.spu.reqSkuList(spu.id);
      if (res.code == 200) {
        this.skuList = res.data;
        //loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(){
      //loading属性再次变为真
      this.loading = true;
      //清除sku列表的数据
      this.skuList = [];
      //管理对话框
      done();
    }
  },
};
</script>
<style scoped>
</style>
