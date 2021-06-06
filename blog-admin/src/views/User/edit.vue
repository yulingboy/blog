<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 用户管理 </el-breadcrumb-item>
                <el-breadcrumb-item>用户编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="Id">
                        <el-input v-model="form._id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="昵称">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>

                    <el-form-item label="权限">
                        <el-radio-group v-model="form.role">
                            <el-radio :label="0" value="0">游客</el-radio>
                            <el-radio :label="1" value="1">管理员</el-radio>
                            <el-radio :label="2" value="2">超级管理员</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-radio-group v-model="form.state">
                            <el-radio :label="0" value="0">启用</el-radio>
                            <el-radio :label="1" value="1">禁用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="头像">
                        <div class="crop-demo">
                            <img :src="cropImg" class="pre-img" />
                            <div class="crop-demo-btn">
                                选择图片
                                <input class="crop-input" type="file" name="uploadimage" accept="image/*" @change="setImage" />
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper
                    ref="cropper"
                    :src="form.avatar_url"
                    :ready="cropImage"
                    :zoom="cropImage"
                    :cropmove="cropImage"
                    style="width:100%;height:300px;"
                ></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="uploadImage">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
export default {
    name: 'baseform',
    components: {
        VueCropper
    },
    data() {
        return {
            options: [
                {
                    value: 'guangdong',
                    label: '广东省',
                    children: [
                        {
                            value: 'guangzhou',
                            label: '广州市',
                            children: [
                                {
                                    value: 'tianhe',
                                    label: '天河区'
                                },
                                {
                                    value: 'haizhu',
                                    label: '海珠区'
                                }
                            ]
                        },
                        {
                            value: 'dongguan',
                            label: '东莞市',
                            children: [
                                {
                                    value: 'changan',
                                    label: '长安镇'
                                },
                                {
                                    value: 'humen',
                                    label: '虎门镇'
                                }
                            ]
                        }
                    ]
                },
                {
                    value: 'hunan',
                    label: '湖南省',
                    children: [
                        {
                            value: 'changsha',
                            label: '长沙市',
                            children: [
                                {
                                    value: 'yuelu',
                                    label: '岳麓区'
                                }
                            ]
                        }
                    ]
                }
            ],
            form: {
                _id: '',
                username: '',
                email: '',
                role: null,
                state: null,
                avatar_url: ''
            },
            dialogVisible: false,
            imgSrc: '',
            cropImg: '',
            file: null
        };
    },
    created() {
        this.getUserById();
    },
    methods: {
        // 根据ID获取用户信息
        getUserById() {
            this.$api.user(this.$route.params.id).then(res => {
                console.log(res);
                this.form = {
                    _id: res.data._id,
                    username: res.data.username,
                    email: res.data.email,
                    role: res.data.role,
                    state: res.data.state,
                    avatar_url: res.data.avatar_url
                };
            });
        },
        // 设置图片预览
        setImage(e) {
            this.file = e.target.files[0];
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = event => {
                this.dialogVisible = true;
                this.form.avatar_url = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        // 上传图片
        uploadImage() {
            console.log(this.file);
            let data = new FormData();
            data.append('file', this.file);
            this.$api.upload(data).then(res => {
                console.log(res.data.avatar_url);
                this.form.avatar_url = res.data.avatar_url;
                this.dialogVisible = false;
            });
        },
        // 图片编辑
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        // 取消编辑，图片恢复成原来的图片
        cancelCrop() {
            this.dialogVisible = false;
            this.cropImg = this.form.avatar_url;
        },
        // 确认编辑
        onSubmit() {
            this.$api.userEdit(this.$route.params.id, this.form).then(res => {
                this.getUserById();
                this.$message.success('提交成功！');
                this.$router.push('/user');
            });
        }
    }
};
</script>
<style scoped>
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
