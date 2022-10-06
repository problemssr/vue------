<template>
  <div>
    <!-- :inline行内表单 代表一行收集多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集一级二级三级分类的id
      cForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    //获取一级分类 （不带参）
    async getCategory1List() {
      const res = await this.$API.attr.reqCategory1List();
      if (res.code == 200) {
        this.list1 = res.data;
      }
    },
    // 一级分类的select事件回调（当一级分类option发生变化获取相应的二级分类数据）
    async handler1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2id = "";
      this.cForm.category3id = "";

      // 解构一级分类id
      const { category1id } = this.cForm;
      // 子传父
      this.$emit("getCategoryId", { categoryid: category1id, level: 1 });
      const res = await this.$API.attr.reqCategory2List(category1id);
      if (res.code == 200) {
        this.list2 = res.data;
      }
    },
    // 二级分类的select事件回调（当一级分类option发生变化获取相应的二级分类数据）
    async handler2() {
      const { category2id } = this.cForm;
      this.$emit("getCategoryId", { categoryid: category2id, level: 2 });
      let res = await this.$API.attr.reqCategory3List(category2id);
      if (res.code == 200) {
        this.list3 = res.data;
      }
    },
    // 三级分类的select事件回调（当一级分类option发生变化获取相应的二级分类数据）
    handler3() {
      // 获取三级分类id
      const { category3id } = this.cForm;
      this.$emit("getCategoryId", { categoryid: category3id, level: 3 });
    },
  },
};
</script>
<style scoped>
</style>
