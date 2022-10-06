<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="120">
        <template slot-scope="{ row, index }">
          <img :src="row.skuDefaultImg" style="height: 80px; width: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="300">
        <template slot-scope="{ row, index }">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-top"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-bottom"
            v-else
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-warning"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      style="text-align: center; margin-top: 5px"
      :current-page="2"
      :page-sizes="[3, 5, 10]"
      :page-size="3"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="40"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="45%">
      <el-row>
        <el-col :span="5">名称 </el-col>
        <el-col :span="16">{{ skuInfo.skuName }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述 </el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格 </el-col>
        <el-col :span="16">{{ skuInfo.price }} </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性 </el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              style="margin-right: 5px"
              v-for="(skuAttrValue, index) in skuInfo.skuAttrValueList"
              :key="index"
              >{{ skuAttrValue.valueName }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片 </el-col>
        <el-col :span="16">
          <el-carousel>
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1, //代表当前第几页
      limit: 10, //代表当前页面有几条数据
      records: [], //存储SKU列表的数据
      total: 0, //存储分页器一共展示的数据
      skuInfo: {}, //存储SKU信息
      show: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    //获取sku列表数据的方法
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let res = await this.$API.sku.reqSkuList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.records = res.data.records;
      }
    },
    handleSizeChange(limit = 1) {
      //修改参数
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let res = await this.$API.sku.reqSale(row.id);
      if (res.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    // 下架
    async cancel(row) {
      let res = await this.$API.sku.reqCancelSale(row.id);
      if (res.code == 200) {
        row.isSale = 0;
        this.$message({
          type: "info",
          message: "下架成功",
        });
      }
    },
    edit() {
      this.$message({
        type: "info",
        message: "正在开发中...",
      });
    },
    //获取SKU详情的方法
    async getSkuInfo(sku) {
      //展示抽屉
      this.show = true;
      let res = await this.$API.sku.reqSkuById(sku.id);
      if (res.code == 200) {
        this.skuInfo = res.data;
      }
    },
  },
};
</script>
<style scoped>
.el-col-5 {
  font-size: 20px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
