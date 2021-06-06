import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);


const routes =  [
        // {
        //     path: '/',
        //     redirect: '/dashboard'
        // },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '@/components/Home.vue'),
            redirect: '/dashboard',
            meta: { title: '数据中心' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard/index.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Transfor.vue'),
                    meta: { title: '用户管理' },
                    children:[
                        {
                            path:'/',
                            name:'userList',
                            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/User/index.vue'),
                            meta: { title: '用户列表' },
                        },
                        {
                            path:'edit/:id',
                            name:'userEdit',
                            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/User/edit.vue'),
                            meta: { title: '编辑用户' },
                        }
                    ]
                },
                {
                    path:'/article',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Transfor.vue'),
                    meta: { title: '文章管理' },
                    children:[
                        {
                            path:'/',
                            name:'articleList',
                            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Article/index.vue'),
                            meta: { title: '文章列表' },
                        },
                        {
                            path:'edit/:id',
                            name:'articleEdit',
                            component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Article/edit.vue'),
                            meta: { title: '编辑文章' },
                        }
                    ]
                },
                {
                    path: '/category',
                    component: () => import(/* webpackChunkName: "icon" */ '@/views/Category/index.vue'),
                    meta: { title: '分类管理' }
                },
                {
                    path: '/log',
                    component: () => import(/* webpackChunkName: "table" */ '@/views/Log/index.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/task',
                    component: () => import(/* webpackChunkName: "tabs" */ '@/views/Task/index.vue'),
                    meta: { title: '任务管理' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ];
const router = new VueRouter({
    routes
  });

  const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {

return originalPush.call(this, location).catch(err => err)

}

  
  router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.path !== '/login') {
      if (localStorage.token) {
        next();
      } else {
        next('/login');
      }
    }
    next();
  });
  
  export default router;