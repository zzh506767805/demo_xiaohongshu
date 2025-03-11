import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页面
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        default:
          console.error('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

// 内容管理相关接口
export const contentApi = {
  // 获取内容列表
  getContentList: (params: any) => api.get('/content/list', { params }),
  // 创建内容
  createContent: (data: any) => api.post('/content/create', data),
  // 更新内容
  updateContent: (id: string, data: any) => api.put(`/content/${id}`, data),
  // 删除内容
  deleteContent: (id: string) => api.delete(`/content/${id}`)
};

// 发布计划相关接口
export const planApi = {
  // 获取计划列表
  getPlanList: (params: any) => api.get('/plan/list', { params }),
  // 创建计划
  createPlan: (data: any) => api.post('/plan/create', data),
  // 更新计划
  updatePlan: (id: string, data: any) => api.put(`/plan/${id}`, data),
  // 删除计划
  deletePlan: (id: string) => api.delete(`/plan/${id}`)
};

// 朋友圈管理相关接口
export const momentApi = {
  // 获取朋友圈列表
  getMomentList: (params: any) => api.get('/moment/list', { params }),
  // 创建朋友圈
  createMoment: (data: any) => api.post('/moment/create', data),
  // 更新朋友圈
  updateMoment: (id: string, data: any) => api.put(`/moment/${id}`, data),
  // 删除朋友圈
  deleteMoment: (id: string) => api.delete(`/moment/${id}`)
};

// 账户相关接口
export const accountApi = {
  // 登录
  login: (data: any) => api.post('/auth/login', data),
  // 获取用户信息
  getUserInfo: () => api.get('/user/info'),
  // 更新用户信息
  updateUserInfo: (data: any) => api.put('/user/info', data)
};