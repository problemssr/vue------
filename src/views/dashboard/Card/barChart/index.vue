<template>
  <div class="charts" ref="echarts">aaa</div>
</template>
<script>
// 引入echarts
import * as echarts from "echarts";
export default {
  mounted() {
    //初始化echarts实例（可以获取dom）
    let lineCharts = echarts.init(this.$refs.echarts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //均分数据
        type: "category",
      },
      yAxis: {
        show: false,
      },
      //系列
      series: [
        {
          type: "bar",
          data: [15, 40,20,11,50,32, 44, 20,69,25,78,100],
          
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      //提示
      tooltip:{}
    });
  },
};
</script>
<style scoped>
.charts {
  height: 70px;
  width: 100%;
}
</style>