import { querySubmissions } from '@/services/api';

export default {
  namespace: 'submissions',
  state: {
    submissions: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(querySubmissions);
      if (data.relatedSubmissions) {
        yield put({
          type: 'save',
          payload: {
            submissionsList: data.relatedSubmissions,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        submissions: payload.submissionsList,
      };
    },
  },
};
