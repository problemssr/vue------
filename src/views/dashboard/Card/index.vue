<template>
  <div>
    <el-row :gutter="20">
      <!-- 第一个card -->
      <el-col :span="6" :offset="0">
        <el-card shadow="always">
          <Detail title="总销售额" count="￥126560">
            <!-- 传结构 -->
            <template slot="chart">
              <span
                >周同比 56.67%
                <svg
                  t="1648011920685"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2193"
                  width="16"
                  height="16"
                >
                  <path
                    d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                    p-id="2194"
                    fill="#d81e06"
                  ></path>
                </svg>
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span
                >日同比 18.16%
                <svg
                  t="1648011980291"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3218"
                  width="16"
                  height="16"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#1afa29"
                    p-id="3219"
                  ></path></svg
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6" :offset="0">
        <el-card shadow="always">
          <Detail title="访问量" count="88460">
              <template slot="chart">
              <lineCharts></lineCharts>
              </template>
            <template slot="footer">
              <span>日销售额 12423</span>
            </template></Detail
          >
        </el-card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6" :offset="0">
        <el-card shadow="always">
          <Detail title="支付笔数" count="88460">
            <template slot="chart">
                <barCharts></barCharts>
            </template>
            <template slot="footer">
              <span>转化率 65%</span>
            </template></Detail
          >
        </el-card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6" :offset="0">
        <el-card shadow="always">
          <Detail title="运营活动效果" count="78%">
              <template slot="chart">
                  <progressCharts></progressCharts>
              </template>
            <template slot="footer">
                <div style="font-size: 14px;">
              <span
                >周同比 56.67%
                <svg
                  t="1648011920685"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2193"
                  width="16"
                  height="16"
                >
                  <path
                    d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
                    p-id="2194"
                    fill="#d81e06"
                  ></path>
                </svg>
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span
                >日同比 18.16%
                <svg
                  t="1648011980291"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3218"
                  width="16"
                  height="16"
                >
                  <path
                    d="M64 320l448 448 448-448z"
                    fill="#1afa29"
                    p-id="3219"
                  ></path></svg
              ></span> </div>
              </template>
              </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Detail from "./Detail";
import lineCharts from "./lineChart";
import barCharts from "./barChart";
import progressCharts from "./progressChart";
export default {
  components: {
    Detail,
    lineCharts,
    barCharts,
    progressCharts
  },
};
</script>
<style scoped>
</style>