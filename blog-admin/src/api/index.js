import axios from '@/axios';

// 登录
export const login = params => {
  return axios.post('/login', params);
};
// 登录
export const upload = params => {
    return axios.post('/upload', params);
  };
// 获取用户列表
export const users = params => {
  return axios.get('/users', { params: params });
};
// 根据ID查询用户信息
export const user = id => {
  return axios.get('/users/' + id);
};
// 修改用户信息
export const userEdit = (id, params) => {
  return axios.put('/users/' + id, params);
};
// 删除用户
export const userDelete = id => {
  return axios.delete('/users/' + id);
};

// 新增分类
export const categoryAdd = params => {
  return axios.post('/categories', params);
};
// 删除分类
export const categoryDelete = id => {
  return axios.delete('/categories/' + id);
};
// 修改分类
export const categoryEdit = (id, params) => {
  return axios.put('/categories/' + id, params);
};
// 根据ID查询分类
export const category = id => {
  return axios.get('/categories/' + id);
};
// 查询分类列表
export const categories = params => {
  return axios.get('/categories', { params: params });
};
// 部分页查询分类
export const allCategories = params => {
  return axios.get('/categories');
};

// 新增文章 
export const articleAdd = params => {
  return axios.post('/articles', params);
};
// 删除文章
export const articleDelete = id => {
  return axios.delete('/articles/' + id);
};
// 修改文章
export const articleEdit = (id, params) => {
  return axios.put('/articles/' + id, params);
};
// 根据ID查询文章
export const article = id => {
  return axios.get('/articles/' + id);
};
// 查询文章列表
export const articles = params => {
  return axios.get('/articles', { params: params });
};

// 新增任务
export const taskAdd = params => {
  return axios.post('/tasks', params);
};
// 删除任务
export const taskDelete = id => {
  return axios.delete('/tasks/' + id);
};
// 修改任务
export const taskEdit = (id, params) => {
  return axios.put('/tasks/' + id, params);
};
// 根据ID查询任务
export const task = id => {
  return axios.get('/tasks/' + id);
};
// 查询分类列表
// export const categories = params => {
//   return axios.get('/categories', { params: params });
// };
// 不分页查询任务
export const allTasks = params => {
  return axios.get('/allTasks');
};
