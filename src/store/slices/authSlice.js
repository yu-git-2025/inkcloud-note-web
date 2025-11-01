import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 发送验证码
export const sendVerificationCode = createAsyncThunk(
  'auth/sendCode',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/v1/sms/code/send', { phone });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '发送失败');
    }
  }
);

// 登录
export const login = createAsyncThunk(
  'auth/login',
  async ({ phone, code, password }, { rejectWithValue }) => {
    try {
      const data = code ? { phone, code } : { phone, password };
      const response = await api.post('/user/v1/user/login', data);
      if (response.data.code == 200) {
        const { token, refreshToken, userId, nickname, avatar } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        return response.data.data;
      }
      return rejectWithValue(response.data.msg || '登录失败');
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '登录失败');
    }
  }
);

// 注册
export const register = createAsyncThunk(
  'auth/register',
  async ({ phone, code, password }, { rejectWithValue }) => {
    try {
      const data = code ? { phone, code } : { phone, password };
      const response = await api.post('/user/v1/user/register', data);
      if (response.data.code == 200) {
        return response.data.msg;
      }
      return rejectWithValue(response.data.msg || '注册失败');
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '注册失败');
    }
  }
);

// 退出登录
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 发送验证码
      .addCase(sendVerificationCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendVerificationCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerificationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 登录
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // 注册
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // 退出登录
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

