import { queryDiscussions } from '@/services/api';

export default {
  namespace: 'discussion',
  state: {
    discussion: {},
  },
  effects: {
    *fetchDiscussion({ payload }, { call, put }) {
      const { discussionId } = payload;
      const { data } = yield call(queryDiscussions, [discussionId]);
      const target = (data.discussions && data.discussions[0]) || null;
      if (target) {
        yield put({
          type: 'save',
          payload: {
            discussion: target,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        discussion: payload.discussion,
      };
    },
  },
};
