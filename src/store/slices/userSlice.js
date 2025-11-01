import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取用户信息
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/v1/user/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取用户信息失败');
    }
  }
);

// 编辑个人信息
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/v1/user/profile/edit', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新用户信息失败');
    }
  }
);

// 获取统计数据
export const fetchUserStatistics = createAsyncThunk(
  'user/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/note/v1/statistics/overview');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取统计数据失败');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    statistics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload.data };
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload.data;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;

