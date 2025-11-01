import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取标签列表
export const fetchTags = createAsyncThunk(
  'tag/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/note/v1/tag/list');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '获取标签列表失败');
    }
  }
);

// 创建标签
export const createTag = createAsyncThunk(
  'tag/createTag',
  async (tagData, { rejectWithValue }) => {
    try {
      const response = await api.post('/note/v1/tag/create', tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '创建标签失败');
    }
  }
);

// 更新标签
export const updateTag = createAsyncThunk(
  'tag/updateTag',
  async ({ tagId, ...tagData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/note/v1/tag/update/${tagId}`, tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '更新标签失败');
    }
  }
);

// 删除标签
export const deleteTag = createAsyncThunk(
  'tag/deleteTag',
  async (tagId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/note/v1/tag/delete/${tagId}`);
      return { tagId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '删除标签失败');
    }
  }
);

const tagSlice = createSlice({
  name: 'tag',
  initialState: {
    tags: [],
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
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.data || [];
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.tags.push(action.payload.data);
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        const index = state.tags.findIndex(t => t.tagId === action.payload.data.tagId);
        if (index !== -1) {
          state.tags[index] = action.payload.data;
        }
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.tags = state.tags.filter(t => t.tagId !== action.payload.tagId);
      });
  },
});

export const { clearError } = tagSlice.actions;
export default tagSlice.reducer;

