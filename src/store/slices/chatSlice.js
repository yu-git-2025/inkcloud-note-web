import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// 获取聊天记录
export const fetchChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ friendId, pageNum = 1, pageSize = 50 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/interact/v1/chat/message/list', {
        params: { friendId, pageNum, pageSize },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '获取聊天记录失败');
    }
  }
);

// 发送消息
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ receiveUserId, content, type }, { rejectWithValue }) => {
    try {
      const response = await api.post('/interact/v1/chat/message/send', {
        receiveUserId,
        content,
        type,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '发送消息失败');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},
    currentFriendId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentFriend: (state, action) => {
      state.currentFriendId = action.payload;
    },
    addMessage: (state, action) => {
      const { friendId, message } = action.payload;
      if (!state.messages[friendId]) {
        state.messages[friendId] = [];
      }
      state.messages[friendId].push(message);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        const friendId = action.meta.arg.friendId;
        state.messages[friendId] = action.payload.data?.list || [];
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload.data;
        const friendId = message.receiveUserId || message.sendUserId;
        if (!state.messages[friendId]) {
          state.messages[friendId] = [];
        }
        state.messages[friendId].push(message);
      });
  },
});

export const { setCurrentFriend, addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;

