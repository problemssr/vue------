<template>
  <div class="charts" ref="echarts"></div>
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
        //设置最大值和最小值
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        //均分数据
        type: "category",
      },
      //系列
      series: [
        {
          type: "bar",
          data: [78],
          barWidth: 25,
          color: "yellowgreen",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          label:{
              show:true,
              formatter: '|',
              position:"right"
          }
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
      tooltip: {},
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