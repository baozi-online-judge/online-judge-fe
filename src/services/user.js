import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrentUser() {
  return request('/graphql', {
    method: 'POST',
    body: {
      query: `query {
        current {
          user_id
          nickname
          avatar_url
          email
          role
        }
      }`,
    },
  });
}
