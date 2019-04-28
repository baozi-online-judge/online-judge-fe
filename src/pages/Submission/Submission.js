import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Modal, Card, Tag, Icon, Divider, Row, Col } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import router from 'umi/router';
import styles from './Submission.less';
import { getRandomColor } from '@/utils/tagColors';
import languageMapper from '@/utils/languageMapper';
import Markdown from 'react-markdown';
import Result from '@/components/Result';
import getSocket from '@/utils/socket';

const { confirm } = Modal;

const getMessageType = result => {
  switch (result) {
    case 'ACCEPTED':
      return 'success';
    case 'WAITING':
      return 'warn';
    default:
      return 'error';
  }
};

@connect(({ submission, loading, user }) => ({
  submission,
  loading: loading.effects.submission,
  current: user.currentUser,
}))
class SubmissionDetail extends Component {
  componentDidMount() {
    const { dispatch, match, current } = this.props;
    const { params } = match;
    // 获取第一次题目状态
    dispatch({
      type: 'submission/fetchSubmission',
      payload: {
        recordId: params.sid,
      },
    });
    if (current.user_id) {
      const socket = getSocket();
      // 通过Socket来监听提交记录
      socket.on(`User_${current.user_id}`, recordId => {
        // 该提交记录已更新，重新获取题目状态
        dispatch({
          type: 'submission/fetchSubmission',
          payload: {
            recordId,
          },
        });
      });
    }
  }

  handleClickResetTemplate = () => {
    const {
      submission: { submission: target },
    } = this.props;
    confirm({
      title: '请确认是否重新加载当前代码？',
      content: '将跳转至相应题目',
      onOk: () => {
        console.log(target);
        if (target.problem) {
          router.push({
            pathname: `/problem/${target.problem.problem_id}`,
            query: {
              submission_code: target.record_id,
            },
          });
        }
      },
    });
  };

  handleClickBackToList = () => {
    router.push({
      pathname: '/submissions',
    });
  };

  handleClickToProblem = pid => () => {
    router.push({
      pathname: `/problem/${pid}`,
    });
  };

  getTitle = (text, icon) => {
    return (
      <span className={styles.cardTitle}>
        <Icon type={icon} style={{ marginRight: '.5rem' }} />
        {text}
      </span>
    );
  };

  render() {
    const { loading, submission } = this.props;
    const { submission: target } = submission;
    const language = languageMapper[target.language];

    const options = {
      mode: String(language).toLowerCase(),
      theme: 'xq-light',
      lineNumbers: true,
      readOnly: true,
    };

    const title = (
      <span className={styles.topTitle}>
        {`#${target.record_id} ${target.problem && target.problem.title}`}
      </span>
    );

    const actions = (
      <Button.Group>
        <Button icon="rollback" onClick={this.handleClickBackToList}>
          <FormattedMessage id="app.result.success.btn-return" defaultMessage="Back to list" />
        </Button>
        <Button
          icon="search"
          onClick={this.handleClickToProblem(target.problem && target.problem.problem_id)}
          type="primary"
        >
          <FormattedMessage id="app.result.success.btn-problem" defaultMessage="View project" />
        </Button>
      </Button.Group>
    );

    let extra = null;
    if (target.user_output) {
      if (target.example_input && target.expect_output) {
        extra = (
          <Fragment>
            <Card bordered={false} style={{ marginBottom: '1rem' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card.Meta title={this.getTitle('测试样例', 'diff')} />
                  <Markdown
                    className={styles.innerMarkdown}
                    source={`\`\`\`\n${target.example_input}\n\`\`\``}
                  />
                </Col>
                <Col span={12}>
                  <Card.Meta title={this.getTitle('期望输出', 'smile')} />
                  <Markdown
                    className={styles.innerMarkdown}
                    source={`\`\`\`\n${target.expect_output}\n\`\`\``}
                  />
                </Col>
              </Row>

              <Divider />
              <Card.Meta title={this.getTitle('你的输出', 'warning')} />
              <Markdown
                className={styles.innerMarkdown}
                source={`\`\`\`\n${target.user_output}\n\`\`\``}
              />
            </Card>
          </Fragment>
        );
      } else {
        extra = (
          <Fragment>
            <Card bordered={false} style={{ marginBottom: '1rem' }}>
              <Card.Meta title={this.getTitle('输出信息', 'warning')} />
              <Markdown
                className={styles.innerMarkdown}
                source={`\`\`\`\n${target.user_output}\n\`\`\``}
              />
            </Card>
          </Fragment>
        );
      }
    }

    return (
      <PageHeaderWrapper title="提交记录详情" loading={loading}>
        <Card style={{ marginBottom: '1rem' }} bordered={false} loading={loading}>
          <Card.Meta title={title} />
          <Result
            type={getMessageType(target.result)}
            title={formatMessage({ id: `app.submission.result.${target.result}` })}
            description={`提交于 ${moment(target.time).format('YYYY-MM-DD HH:mm')}`}
            style={{ marginTop: 48, marginBottom: 16 }}
          />
        </Card>
        {extra}
        <Card bordered={false}>
          <div className={styles.panel}>
            {actions}
            <div className={styles.rightTools}>
              {language && <Tag color={getRandomColor(language)}>{language}</Tag>}
              <Button icon="edit" onClick={this.handleClickResetTemplate}>
                重新编辑代码
              </Button>
            </div>
          </div>
          <CodeMirror className={styles.codeMirror} value={target.code} options={options} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SubmissionDetail;
