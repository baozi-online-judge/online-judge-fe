import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { PureComponent } from 'react';
import { Card, Table, Tag, Button, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';

const getTagColor = result => {
  switch (result) {
    case 'ACCEPTED':
      return 'green';
    case 'WAITING':
      return 'orange';
    default:
      return 'red';
  }
};

const handleClickRow = recordId => () => {
  router.push({
    pathname: `/submission/${recordId}`,
  });
};

const columns = [
  {
    title: '序号',
    dataIndex: 'record_id',
    width: '10%',
  },
  {
    title: '题目',
    dataIndex: 'problem.title',
  },
  {
    title: '评测结果',
    dataIndex: 'result',
    width: '10%',
    render: (t, { record_id: recordId }) => {
      return (
        <Tag onClick={handleClickRow(recordId)} color={getTagColor(t)}>
          {formatMessage({ id: `app.submission.result.${t}` })}
        </Tag>
      );
    },
  },
  {
    title: '时间',
    dataIndex: 'time',
    width: '10%',
    render: text => moment(text).fromNow(),
  },
  {
    title: '语言',
    dataIndex: 'language',
    width: '5%',
    render: text => <Tag>{String(text).toUpperCase()}</Tag>,
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    render: (_, { record_id: recordId }) => {
      return (
        <Button onClick={handleClickRow(recordId)}>
          <Icon type="zoom-in" />
          查看详情
        </Button>
      );
    },
  },
];

@connect(({ submissions, loading }) => ({
  submissions,
  loading: loading.models.submissions,
}))
class Submissions extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'submissions/fetch',
    });
  }

  render() {
    const { submissions } = this.props;
    const dataSource = submissions.submissions;
    return (
      <PageHeaderWrapper title="提交记录">
        <Card bordered={false}>
          <Table columns={columns} dataSource={dataSource} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Submissions;
