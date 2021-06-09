<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 文章管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card class="box-card">
            <!-- <div class="box-title">
                <div class="item-title"><span>状态</span></div>
                <div class="item-list">
                    <span @click="changeRole(3)" :class="{ active: role == 3 }">全部</span>
                    <span @click="changeRole(2)" :class="{ active: role == 2 }">垃圾箱</span>
                    <span @click="changeRole(1)" :class="{ active: role == 1 }">草稿</span>
                    <span @click="changeRole(0)" :class="{ active: role == 0 }">发布</span>
                </div>
            </div> -->
            <div class="box-title">
                <div class="item-title"><span>状态</span></div>
                <div class="item-list">
                    <span @click="changeState(2)" :class="{ active: state == 2 }">全部</span>
                    <span @click="changeState(1)" :class="{ active: state == 1 }">草稿</span>
                    <span @click="changeState(0)" :class="{ active: state == 0 }">发布</span>
                </div>
            </div>
        </el-card>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" height="500px">
                <el-table-column prop="_id" label="ID" align="center"></el-table-column>
                <el-table-column prop="title" label="标题" align="center"></el-table-column>
                <el-table-column prop="classify" label="分类" align="center"></el-table-column>
                <el-table-column label="封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="是否置顶" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.isHot ? 'success' : 'info'">{{
                            scope.row.isHot  ? '置顶' :  '普通'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发布" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.isPublish  ? 'success' : 'error'">{{ scope.row.isPublish ? '发布' : '草稿' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="publishDate" label="更新时间" align="center"></el-table-column>
                <el-table-column prop="view" label="阅读数" align="center"></el-table-column>
                <el-table-column prop="comments" label="评论数" align="center"></el-table-column>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
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
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            pageData: {},
            role: 3,
            state:2
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取用户列表
        getData() {
            let  params = {
                // role:this.role, 
                state:this.state,
                ...this.pagition
                }
            this.$api.articles(params).then(res => {
                console.log(res);
                this.pagition = res.pagition;
                this.tableData = res.data.map(item => {
                    item.date = this.moment(item.publishDate).format('YYYY-MM-DD');
                    return item;
                });
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                this.$api.userDelete(row._id).then(res => {
                    this.$message.success('删除成功');
                });
            });
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.$router.push({
                name: 'articleEdit',
                params: { id: row._id }
            });
            // this.editVisible = true;
        },
        changeRole(index) {
            this.role = index;
            this.getData()
        },
        changeState(index) {
            this.state = index;
            this.getData()
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
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
