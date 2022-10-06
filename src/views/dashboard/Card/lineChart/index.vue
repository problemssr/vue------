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
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          data: [15, 40,20,11,50,32, 44, 20,69,25,78,100],
          // 拐点样式
          itemStyle: {
            opacity: 0,
          },
          // 线条样式
          lineStyle: {
            color: "purple",
          },
          // 填充区域颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
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