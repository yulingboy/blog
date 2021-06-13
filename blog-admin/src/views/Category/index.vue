<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="分类名">
                <el-input v-model="classify" placeholder="请输入分类名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">新增</el-button>
            </el-form-item>
        </el-form> 
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" height="380px">
                <el-table-column prop="_id" label="ID" align="center"></el-table-column>
                <el-table-column prop="classify" label="分类"></el-table-column>
                <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑分类" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名">
                    <el-input v-model="form.classify"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增分类" :visible.sync="addtVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名">
                    <el-input v-model="form.classify"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addtVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'users',
    data() {
        return {
            // 初始数据请求参数
            pagition: {
                pageNum: 1,
                pageSize: 10,
                pageCount: 1,
                total: 10
            },
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            classify:null,
            addtVisible:false
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取用户列表
        getData() {
            this.$api.categories(this.pagition).then(res => {
                console.log(res);
                this.pagition = res.pagition;
                this.tableData = res.data.map(item => {
                    item.date = this.moment(item.date).format('YYYY-MM-DD hh:mm:ss');
                    return item;
                });
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$api.categoryDelete(row._id).then(res => {
                    this.$message.success('删除成功');
                    this.getData();
                });
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$api.categoryEdit(this.form._id, this.form).then(res => {
                // console.log(res)
                this.$message.success('修改成功');
            });
        },
        // 新增按钮弹窗显示
        onSubmit(){
          this.addtVisible = true
        },
        // 确认新增
        saveAdd(){
          this.$api.categoryAdd(this.form).then(res=>{
            console.log(res)
            this.$message.success('新增分类成功')
            this.addtVisible = false
            this.getData()
          })
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

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.box-card {
    margin-bottom: 20px;
}
.box-card .box-title {
    font-size: 14px;
    margin: 15px;
    display: flex;
}
.box-card .box-title .item-title span {
    margin: 15px 15px 15px 5px;
}
.item-list span {
    cursor: pointer;
    padding: 5px 10px;
    margin: 0 5px;
}
.active {
    background-color: #000;
    color: #fff;
}
</style>
