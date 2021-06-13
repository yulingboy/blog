<template>
    <section class="main">
        <div class="container">
            <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="任务名">
                <el-input v-model="task" placeholder="请输入任务名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">新增</el-button>
            </el-form-item>
        </el-form>
            <div class="drag-box">
                <div class="drag-box-item">
                    <div class="item-title">todo</div>
                    <draggable v-model="todoData" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="todo" class="item-ul">
                            <div v-for="item in todo" class="drag-list" :key="item._id">
                                {{item.task}}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item">
                    <div class="item-title">doing</div>
                    <draggable v-model="doingData" @remove="removeHandle" :options="dragOptions">
                        <transition-group tag="div" id="doing" class="item-ul">
                            <div v-for="item in doing" class="drag-list" :key="item._id">
                                {{item.task}}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="drag-box-item">
                    <div class="item-title">done</div>
                    <draggable v-model="doneData" @remove="removeHandle" :options="dragOptions" @onEnd="log">
                        <transition-group tag="div" id="done" class="item-ul">
                            <div v-for="item in done" class="drag-list" :key="item._id">
                                {{item.task}}
                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑分类" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名">
                    <el-input v-model="form.task"></el-input>
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
                    <el-input v-model="form.task"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addtVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    import draggable from 'vuedraggable'
    export default {
        name: 'draglist',
        data() {
            return {
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                todo: [],
                doing: [],
                done:[],
                editVisible:false,
                addtVisible:false,
                form:{
                    task:null
                },
                todoData:null,
                doingData:null,
                doneData:null,
                task:null
            }
        }, 
        components:{
            draggable
        },
        created () {
            this.getData()
        },
        methods: {
            removeHandle(event){
                console.log(event.target);
                console.log(event.item.innerText)
                console.log(this[event.from.id])
                let text = this[event.from.id].filter(it=>{
                   return it.task == event.item.innerText
                })
                let param = {
                    status:0
                }
                if(event.to.id == 'todo'){
                    param.status = 0
                }else if(event.to.id == 'doing'){
                     param.status = 1
                }else if(event.to.id == 'done'){
                     param.status = 2
                }
                this.$api.taskEdit(text[0]._id,param).then(res=>{
                    this.getData()
                })
                console.log(text)
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },
            log(item){console.log(item)},
            getData() {
                this.todo = []
                this.doing = []
                this.done = []
            this.$api.allTasks().then(res => {
                console.log(res);
                res.data.forEach(item => {
                    if(item.status == 0){
                        this.todo.push(item)
                    }else if(item.status == 1){
                        this.doing.push(item)
                    }else if(item.status == 2){
                        this.done.push(item)
                    }
                });
                // this.tableData = res.data.map(item => {
                //     item.date = this.moment(item.date).format('YYYY-MM-DD hh:mm:ss');
                //     return item;
                // });
            });
        },
            // 新增按钮弹窗显示
        onSubmit(){
          this.addtVisible = true
        },
        // 确认新增 
        saveAdd(){
          this.$api.taskAdd(this.form).then(res=>{
            console.log(res)
            this.$message.success('新增任务成功')
            this.addtVisible = false
            // this.getData()
          })
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$api.taskEdit(this.form._id, this.form).then(res => {
                // console.log(res)
                this.$message.success('修改成功');
            });
        },
        }
    }

</script>

<style scoped>
    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        max-width: 33%;
        min-width: 300px;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        height: 500px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }
    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }
</style>
