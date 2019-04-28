import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

/** ************************************************
 * Login
 ************************************************ */
export async function accountLogin(params) {
  const { userId, password, rememberMe } = params;
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `mutation {
        login(user_id: "${userId}", password: "${password}", remember_me: ${rememberMe}) {
          user_id
          role
          nickname
        }
      }`,
      operation: 'login',
    },
  });
}

export async function accountLogout() {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `mutation {
        logout
      }`,
    },
  });
}

export async function register(params) {
  const { userId, nickname, password, email } = params;
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `mutation {
        register(
          user_id: "${userId}",
          password: "${password}",
          nickname: "${nickname}"
          email: "${email}"
          ) {
          user_id
          role
          nickname
        }
      }`,
      operation: 'register',
    },
  });
}

/** ************************************************
 * Problems
 ************************************************ */
export async function queryProblems() {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `query {
        problems(ids: [], extract: 140) {
          problem_id
          title
          tags
          difficulty
          content
        }
      }`,
    },
  });
}

export async function queryProblem({ problemId }) {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `query {
        problems(ids: [ "${problemId}" ]) {
          problem_id
          title
          tags
          difficulty
          content
          template
          require_time
        }
      }`,
    },
  });
}

export async function submitCode({ problemId, language, code }) {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `mutation Submit($problemId: String!, $language: String!, $code: String!) {
        submitCode(problem_id: $problemId, language: $language, code: $code) {
          record_id
          result
          time
        }
      }
      `,
      variables: {
        problemId,
        language,
        code,
      },
    },
  });
}

/** ************************************************
 * Submissions
 ************************************************ */
export async function querySubmissions() {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `query {
        relatedSubmissions {
          record_id
          result
          time
          language
          problem {
            problem_id
            title
          }
        }
      }`,
    },
  });
}

export async function queryDetail({ recordId }) {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `query {
        detail(recordId: "${recordId}") {
          result
          record_id
          example_input
          expect_output
          user_output
          language
          code
          time
          problem {
            problem_id
            title
          }
        }
      }`,
    },
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getTitle(userId) {
  const list = await request(`/api/problems?user_id=${userId}`);
  return list.map(item => item.title);
}
