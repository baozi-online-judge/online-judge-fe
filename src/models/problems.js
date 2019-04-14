import { queryProblems } from '@/services/api';

export default {
  namespace: 'problems',
  state: {
    problems: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const { data } = yield call(queryProblems);
      if (data.problems) {
        yield put({
          type: 'queryProblems',
          payload: {
            problemsList: data.problems,
          },
        });
      }
    },
  },
  reducers: {
    queryProblems(state, { payload }) {
      return {
        ...state,
        problems: payload.problemsList,
      };
    },
  },
};
