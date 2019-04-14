import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect()
class Submissions extends PureComponent {
  componentDidMount() {}

  render() {
    return <PageHeaderWrapper title="提交列表">123</PageHeaderWrapper>;
  }
}

export default Submissions;
