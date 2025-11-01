import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取好友列表
export const fetchFriends = createAsyncThunk(
  'friend/fetchFriends',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/interact/v1/friend/list');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '获取好友列表失败');
    }
  }
);

// 添加好友
export const addFriend = createAsyncThunk(
  'friend/addFriend',
  async ({ friendPhone, remark }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/v1/friend/add', { friendPhone, remark });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '添加好友失败');
    }
  }
);

// 删除好友
export const deleteFriend = createAsyncThunk(
  'friend/deleteFriend',
  async (friendId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/interact/v1/friend/delete/${friendId}`);
      return { friendId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || '删除好友失败');
    }
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    friends: [],
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
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload.data || [];
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.friends.push(action.payload.data);
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(f => f.friendId !== action.payload.friendId);
      });
  },
});

export const { clearError } = friendSlice.actions;
export default friendSlice.reducer;

