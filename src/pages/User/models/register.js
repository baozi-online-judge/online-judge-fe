import { register } from '@/services/api';

export default {
  namespace: 'register',

  state: {
    status: null,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { userId, nickname, password, email } = payload;
      const { data } = yield call(register, { userId, nickname, password, email });
      if (data) {
        yield put({
          type: 'registerHandle',
          payload: {
            status: (Boolean(data.register) && 'ok') || 'error',
          },
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      const { status } = payload;
      return {
        ...state,
        status,
      };
    },
  },
};
