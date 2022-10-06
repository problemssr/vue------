<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px" @click="showDialog" />添加
    <!-- 表格组件
    :data展示的数据（数组）
    border边框
    column属性
    label:显示标题
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index" />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 50px; height: 50px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total 总页数
      :current-page 当前页数
      :page-size 默认每页显示的条数数据
      :page-sizes 选择每页显示的条数数据
      layout 实现分页器布局
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="9"
      layout=" prev, pager, next, jumper,->,total, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 对话框
    :visible.sync:控制对话框显示与隐藏
    -->
    <el-dialog :title="this.tmForm.id ?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 model属性：表单收集的数据放到那个对象剩下，表单验证也需要此属性 -->
      <el-form :model="tmForm" style="widith:80%" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- el-upload上传照片
            收集数据不能用v-model不是表单元素，
            action：设置图片上传地址
            :on-success="handleAvatarSuccess"检测图片上传成功，会执行一次
            :before-upload="beforeAvatarUpload" 在上传图片前执行一次-->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line quotes
  name: "Trademark",
  data() {
    return {
      page: 3,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        // 上传图片属性
        logoUrl: '',
        tmName: ''
      },
      // 表单验证规则
      // required:必须校验字段（前面五角星） message提示信息  trigger用户行为（事件的设置：blur，change）
      // change文本变化
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    // 获取品牌列表数据
    async getPageList() {
      const { page, limit } = this
      const res = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    // 展示当前页
    handleCurrentChange(page) {
      this.page = page
      this.getPageList()
    },
    // 传递展示多少条
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList(limit)
    },
    // 点击添加按钮（对话框）
    showDialog() {
      this.dialogFormVisible = true
      // 清除数据tmform
      this.tmForm = { tmName: '', logoUrl: '' }
    },
    // 点击修改按钮（对话框）
    async updateTradeMark(row) {
      this.dialogFormVisible = true
      console.log(row);
      // // 将用户修改数据的值传给tmform，浅拷贝
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res：收集的数据 file多了些
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 增加或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求（add|update）
          const res = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
          if (res.code === 200) {
            // 弹出成功
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // 添加品牌留在第一页，修改品牌留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        }else {
          console.log('error submit')
          return false
        }
      })
    },
    // 删除品牌
    deleteTrademark(row) {
      // 弹框
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当点击确定按钮
        const res = await this.$API.tradeMark.reqDeleteTrademark(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 再次发请求
        this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
      }).catch(() => {
        // 当点击取消按钮
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  </style>
