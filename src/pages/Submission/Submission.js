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

@connect(({ submission, loading }) => ({
  submission,
  loading: loading.effects.submission,
}))
class SubmissionDetail extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch({
      type: 'submission/fetchSubmission',
      payload: {
        recordId: params.sid,
      },
    });
  }

  handleClickResetTemplate = () => {
    const {
      submission: { submission: target },
    } = this.props;
    confirm({
      title: '请确认是否使当前代码重置为模板代码？',
      content: '这会导致您当前的代码丢失，请确认是否有备份',
      onOk: () => {
        // eslint-disable-next-line no-console
        console.log(target);
        // noop
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

    const extra =
      target.example_input && target.expect_output && target.user_output ? (
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
      ) : null;

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
