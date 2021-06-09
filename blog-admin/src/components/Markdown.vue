<template>
    <div>
        <mavon-editor v-model="content" ref="md" @imgAdd="$imgAdd" @change="change" :subfield="false" style="min-height: 600px"/>
    </div>
</template>

<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
        name: 'markdown',
        data: function(){
            return {
                // content:'',
                html:'',
                configs: {
                }
            }
        },
        props:["content"],
        components: {
            mavonEditor
        },
        methods: {
            // 将图片上传到服务器，返回地址替换到md中
            $imgAdd(pos, $file){
                console.log(pos,$file)
                var formdata = new FormData();
                const file = formdata.append('file', $file);
                
                // 这里没有服务器供大家尝试，可将下面上传接口替换为你自己的服务器接口
                this.$api.upload(file).then((url) => {
                    console.log(url)
                    this.$refs.md.$img2Url(pos, url);
                })
            },
            change(value, render){
                // render 为 markdown 解析后的结果
                this.html = render;
            },
            submit(){
                console.log(this.content);
                console.log(this.html);
                this.$message.success('提交成功！');
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>