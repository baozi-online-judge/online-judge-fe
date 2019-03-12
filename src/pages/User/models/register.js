import { register } from '@/services/api';
import { notification } from 'antd';
import { formatMessage } from 'umi/locale';

export default {
  namespace: 'register',

  state: {
    status: false,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const { userId, nickname, password, email } = payload;
      const { data } = yield call(register, { userId, nickname, password, email });
      if (data) {
        if (data.register) {
          yield put({
            type: 'registerHandle',
            payload: {
              status: Boolean(data.register),
              role: data.register.role,
            },
          });
        } else {
          notification.error({
            message: formatMessage({ id: 'validation.userId.used' }),
          });
        }
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
