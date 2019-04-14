import { queryProblem } from '@/services/api';

export default {
  namespace: 'problem',
  state: {
    problem: {},
  },
  effects: {
    *fetchProblem({ payload }, { call, put }) {
      const { problemId } = payload;
      const { data } = yield call(queryProblem, { problemId });
      const target = (data.problems && data.problems[0]) || null;
      if (target) {
        yield put({
          type: 'save',
          payload: {
            problem: target,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        problem: payload.problem,
      };
    },
  },
};
