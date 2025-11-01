import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取笔记列表
export const fetchNotes = createAsyncThunk(
  'note/fetchNotes',
  async ({ categoryId, tagId, keyword, pageNum = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const params = { pageNum, pageSize };
      if (categoryId) params.categoryId = categoryId;
      if (tagId) params.tagId = tagId;
      if (keyword) params.keyword = keyword;
      const response = await api.get('/note/v1/note/list', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取笔记列表失败');
    }
  }
);

// 创建笔记
export const createNote = createAsyncThunk(
  'note/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await api.post('/note/v1/note/create', noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '创建笔记失败');
    }
  }
);

// 获取笔记详情
export const fetchNoteDetail = createAsyncThunk(
  'note/fetchNoteDetail',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/note/v1/note/detail/${noteId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取笔记详情失败');
    }
  }
);

// 更新笔记
export const updateNote = createAsyncThunk(
  'note/updateNote',
  async ({ noteId, ...noteData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/note/v1/note/update/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '更新笔记失败');
    }
  }
);

// 删除笔记
export const deleteNote = createAsyncThunk(
  'note/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/note/v1/note/delete/${noteId}`);
      return { noteId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '删除笔记失败');
    }
  }
);

// 获取笔记版本列表
export const fetchNoteVersions = createAsyncThunk(
  'note/fetchNoteVersions',
  async ({ noteId, pageNum = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/note/v1/note/version/list', {
        params: { noteId, pageNum, pageSize },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取版本列表失败');
    }
  }
);

const noteSlice = createSlice({
  name: 'note',
  initialState: {
    notes: [],
    currentNote: null,
    versions: [],
    total: 0,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    clearCurrentNote: (state) => {
      state.currentNote = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取笔记列表
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data?.list || [];
        state.total = action.payload.data?.total || 0;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 创建笔记
      .addCase(createNote.pending, (state) => {
        state.saving = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.saving = false;
        state.notes.unshift(action.payload.data);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // 获取笔记详情
      .addCase(fetchNoteDetail.fulfilled, (state, action) => {
        state.currentNote = action.payload.data;
      })
      // 更新笔记
      .addCase(updateNote.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.saving = false;
        state.currentNote = action.payload.data;
        const index = state.notes.findIndex(n => n.noteId === action.payload.data.noteId);
        if (index !== -1) {
          state.notes[index] = action.payload.data;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      // 删除笔记
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n.noteId !== action.payload.noteId);
      })
      // 获取版本列表
      .addCase(fetchNoteVersions.fulfilled, (state, action) => {
        state.versions = action.payload.data?.list || [];
      });
  },
});

export const { setCurrentNote, clearCurrentNote, clearError } = noteSlice.actions;
export default noteSlice.reducer;

