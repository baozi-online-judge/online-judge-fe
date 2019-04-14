import { queryDetail } from '@/services/api';

export default {
  namespace: 'submission',
  state: {
    submission: {},
  },
  effects: {
    *fetchSubmission({ payload }, { call, put }) {
      const { recordId } = payload;
      const { data } = yield call(queryDetail, { recordId });
      const target = data.detail || null;
      if (target) {
        yield put({
          type: 'save',
          payload: {
            submission: target,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        submission: payload.submission,
      };
    },
  },
};
