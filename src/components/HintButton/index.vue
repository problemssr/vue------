<template>
    <a :title="title" style="margin:10px">
        <!-- $attrs:父组件给子组件传的属性 -->
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>
<script>
export default {
    name:'HintButton',
    props:['title']
}
</script>
<style scoped>
</style>