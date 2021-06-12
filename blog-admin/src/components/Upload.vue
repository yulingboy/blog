<template>
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
</template>

<script>
import VueCropper from 'vue-cropperjs';
export default {
    components: {
        VueCropper
    },
    methods: {
         // 图片编辑
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
    }
};
</script>

<style></style>
