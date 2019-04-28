import { queryDiscussions } from '@/services/api';

export default {
  namespace: 'discussions',
  state: {
    discussions: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(queryDiscussions);
      if (data.discussions) {
        yield put({
          type: 'save',
          payload: {
            discussionsList: data.discussions,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        discussions: payload.discussionsList,
      };
    },
  },
};
