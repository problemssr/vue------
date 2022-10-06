<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShow"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          :disabled="!category3id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示属性 -->
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <!-- 想加结构需要有作用域插槽 row：数组中每个元素属性-->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 5px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                style="margin-right:5px"
              ></el-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteAttr(row.id)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShow">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
        <el-table border style="width: 100%" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.flag"
                @blur="tolook(row)"
                @keyup.native.enter="tolook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1id: "",
      category2id: "",
      category3id: "",
      // 接受平台属性的数据
      attrList: [],
      // 控制table的展示与隐藏
      isShow: true,
      // 收集新增属性|修改属性使用
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值
        ],
        categoryId: 0, //三级分类id
        categoryLevel: 0,
      },
    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryid, level }) {
      // 区分三级分类的相应id，以及父组件的存储
      if (level == 1) {
        this.category1id = categoryid;
        this.category2id = "";
        this.category3id = "";
      } else if (level == 2) {
        this.category2id = categoryid;
        this.category3id = "";
      } else {
        // 代表三级分类出现，发请求获取平台属性
        this.category3id = categoryid;
        this.getAttrList();
      }
    },
    // 获取平台属性的数据(三级分类的出现)
    async getAttrList() {
      // 获取分类的id
      const { category1id, category2id, category3id } = this;
      let res = await this.$API.attr.reqAttrList(
        category1id,
        category2id,
        category3id
      );
      if (res.code == 200) {
        this.attrList = res.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      // 向属性值数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        // 给每个属性值添加一个标记flag（响应式数据），作用：切换查看与编辑模式，可以实现每个属性值的模式切换
        // flag：数据变化视图跟着变化
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 失去焦点的事件 ---展示span
    tolook(row) {
      // 输入属性值为''，给提示输入
      if (row.valueName.trim() == "") {
        this.$message("请输入文字");
        return;
      }
      // 新增属性值不能和原有属性值一样
      // some() 方法用于检测数组中的元素是否满足指定条件
      // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测
      let isReapeat = this.attrInfo.attrValueList.some((item) => {
        // 将row从数组判断时去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isReapeat) return;
      // row最新输入的属性值
      row.flag = false;
    },
    // 添加属性
    addAttr() {
      this.isShow = false;
      // 清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值
        ],
        categoryId: this.category3id, //三级分类id
        categoryLevel: 3,
      };
    },
    // 修改某属性
    updateAttr(row) {
      this.isShow = false;
      // 选中的属性给attrInfo
      // 数据中对象还包着数组（复杂结构），浅拷贝探测不到，所以要深拷贝
      this.attrInfo = cloneDeep(row);
      // 修改属性添加flag字段
      this.attrInfo.attrValueList.forEach((item) => {
        // 给属性值添加flag字段，但视图无变化 item.flag=false
        // vue无法探测普通新增的property，不是响应式属性
        // this.$set(item,'flag',false) 第一个参数：对象 第二个参数：响应式属性 第三个参数：新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    // 点击span回调，编辑模式 有光标
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 切换input变为编辑模式，对于浏览器而言，页面重绘重排需要时间
      // $nextTick,当节点渲染完毕，会执行一次
      this.$nextTick(() => {
        // 获取相应input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    // 修改里的删除按钮的气泡确认框的回调
    deleteAttrValue(index) {
      // 不发请求
      // splice() 方法用于添加或删除数组中的元素。
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，进行添加属性或修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数 用户添加空属性不提交、flag字段不提交
      // filter属性：返回新数组，起始数据中筛处想要的元素，返回布尔*************
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不为空的
          if (item.valueName != "") {
            // 删除flag属性
            delete item.flag;
            return true;
          }
        }
      );
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShow = true;
        this.$message({ type: "success", message: "保存成功" });
        // 保存成功后再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
    // 删除属性
    async deleteAttr(attrId){
      await this.$API.attr.reqDeleteAttr(attrId)
      this.getAttrList()
    }
  },
};
</script>
<style scoped>
</style>
