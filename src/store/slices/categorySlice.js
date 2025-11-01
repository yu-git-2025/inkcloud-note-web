import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取分类列表
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/note/v1/category/list');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取分类列表失败');
    }
  }
);

// 创建分类
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/note/v1/category/create', categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建分类失败');
    }
  }
);

// 更新分类
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, ...categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/note/v1/category/update/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新分类失败');
    }
  }
);

// 删除分类
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/note/v1/category/delete/${categoryId}`);
      return { categoryId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除分类失败');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          c => c.categoryId === action.payload.data.categoryId
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          c => c.categoryId !== action.payload.categoryId
        );
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

