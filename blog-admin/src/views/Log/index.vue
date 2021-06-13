<template>
  <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="操作日志" name="操作日志">
         <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" height="380px">
                <el-table-column prop="admin" label="操作人" align="center"></el-table-column>
                <el-table-column prop="type" label="操作类型" align="center"></el-table-column>
                <el-table-column prop="area" label="操作地点" align="center"></el-table-column>
                <el-table-column prop="brower" label="浏览器" align="center"></el-table-column>
                <el-table-column prop="os" label="操作系统" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP" align="center"></el-table-column>
                <el-table-column prop="database" label="数据库" align="center"></el-table-column>
                <el-table-column prop="name" label="操作对象" align="center"></el-table-column>
                <el-table-column prop="responseTime" label="响应时间" align="center"></el-table-column>
                <el-table-column prop="date" label="操作时间" align="center"></el-table-column>
            </el-table>
    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
   <div class="pagination">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="pagition.pageNum"
                :page-size="pagition.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                :total="pagition.total"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </div>
  </div>
</template>

<script>
 export default {
    data() {
      return {
        activeName: '操作日志',
         // 初始数据请求参数
            pagition: {
                pageNum: 1,
                pageSize: 10,
                pageCount: 1,
                total: 10
            },
            tableData: [],
      };
    },
     created() {
        this.getData();
    },
    methods: {
         // 获取用户列表
        getData() {
            this.$api.adminLogs(this.pagition).then(res => {
                console.log(res);
                this.pagition = res.pagition;
                this.tableData = res.data.map(item => {
                    item.date = this.moment(item.date).format('YYYY-MM-DD hh:mm:ss');
                    return item;
                });
            });
        },
      handleClick(tab, event) {
        console.log(tab, event);
      },
       // 分页导航 第几页
        handlePageChange(val) {
            this.pagition.pageNum = val;
            this.getData();
        },
        // 每页多少条数据
        handleSizeChange(val) {
            this.pagition.pageSize = val;
            this.getData();
        }
    }
  };
</script>

<style>

</style>