import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Comment, List, Tooltip, Card, Divider, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import classNames from 'classnames';
import Markdown from 'react-markdown';
import moment from 'moment';
import router from 'umi/router';
import styles from './Discussion.less';

const data = [
  {
    author: '热心市民何同学',
    avatar: 'https://www.easyicon.net/api/resizeApi.php?id=1225569&size=128',
    content:
      '你这个语句中的`target - num`是不确定的。\n``` js\ndict[target - num] = i;\n```\n最后这个`dict`没有返回',
    datetime: (
      <Tooltip
        title={moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(1, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
  {
    author: '热心市民郭同学',
    avatar: 'https://www.easyicon.net/api/resizeApi.php?id=1225565&size=128',
    content:
      'We supply a series of design principles, practical patterns and high quality design' +
      ' resources (Sketch and Axure), to help people create their product prototypes beautifully and' +
      ' efficiently.',
    datetime: (
      <Tooltip
        title={moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD HH:mm:ss')}
      >
        <span>
          {moment()
            .subtract(2, 'days')
            .fromNow()}
        </span>
      </Tooltip>
    ),
  },
];

@connect(({ discussion, loading }) => ({
  discussion,
  loading: loading.effects.discussion,
}))
class DiscussionDetail extends Component {
  codeMirror = React.createRef();

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch({
      type: 'discussion/fetchDiscussion',
      payload: {
        discussionId: params.did,
      },
    });
  }

  handleClickProblemLink = pid => () => {
    router.push({
      pathname: `/problem/${pid}`,
    });
  };

  render() {
    const { loading, discussion } = this.props;
    const { discussion: target } = discussion;

    let problem = null;
    if (target.problem) {
      const difficultyClasses = classNames(styles.difficulty, styles[target.problem.difficulty]);
      problem = (
        <span className={styles.problem}>
          <Icon type="link" />
          <span
            onClick={this.handleClickProblemLink(target.problem.problem_id)}
            className={styles.title}
          >
            {target.problem.title}
          </span>
          <span className={difficultyClasses}>{target.problem.difficulty}</span>
        </span>
      );
    }
    const Description = (
      <div className={styles.description}>
        {problem}
        <span>创建于{moment(target.create_time).fromNow()}</span>
        <span>更新于{moment(target.update_time).fromNow()}</span>
      </div>
    );
    return (
      <PageHeaderWrapper title="讨论详情" loading={loading}>
        <Card style={{ marginBottom: '1rem' }} bordered={false} loading={loading}>
          <Card.Meta title={target.title} description={Description} />
          <Divider />
          <Markdown className={styles.markdown} source={target.content} />
        </Card>
        <Card bordered={false}>
          <List
            className="comment-list"
            header={`${data.length} 条评论回复`}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <Comment
                actions={item.actions}
                author={item.author}
                avatar={item.avatar}
                content={<Markdown className={styles.markdown} source={item.content} />}
                datetime={item.datetime}
              />
            )}
          />
          <div className={styles.submitGroup}>
            <Button onClick={this.handleSubmitCode} type="primary" icon="edit">
              发表评论回复
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DiscussionDetail;
