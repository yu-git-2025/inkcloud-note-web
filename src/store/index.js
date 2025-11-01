import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import noteSlice from './slices/noteSlice';
import categorySlice from './slices/categorySlice';
import tagSlice from './slices/tagSlice';
import friendSlice from './slices/friendSlice';
import chatSlice from './slices/chatSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    note: noteSlice,
    category: categorySlice,
    tag: tagSlice,
    friend: friendSlice,
    chat: chatSlice,
    user: userSlice,
  },
});

// 如果需要类型支持，可以在使用时使用以下方式：
// const state = store.getState();
// const dispatch = store.dispatch;

