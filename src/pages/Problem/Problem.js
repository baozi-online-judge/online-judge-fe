import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Modal, Card, Divider, Select, Tag } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import classNames from 'classnames';
import Markdown from 'react-markdown';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import router from 'umi/router';
import styles from './Problem.less';
import { getRandomColor } from '@/utils/tagColors';
import { submitCode } from '@/services/api';

const { Option } = Select;
const { confirm } = Modal;

const languageMapper = {
  js: 'javascript',
  cpp: 'cpp',
};

@connect(({ problem, loading }) => ({
  problem,
  loading: loading.effects.problem,
}))
class ProblemDetail extends Component {
  codeMirror = React.createRef();

  state = {
    language: 'js',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch({
      type: 'problem/fetchProblem',
      payload: {
        problemId: params.pid,
      },
    });
  }

  handleLanguageChange = value => {
    this.setState({
      language: value,
    });
  };

  handleClickResetTemplate = () => {
    const {
      problem: { problem: target },
    } = this.props;
    confirm({
      title: '请确认是否使当前代码重置为模板代码？',
      content: '这会导致您当前的代码丢失，请确认是否有备份',
      onOk: () => {
        this.codeMirror.current.editor.setValue(target.template);
      },
    });
  };

  handleSubmitCode = async () => {
    const code = this.codeMirror.current.editor.getValue();
    const { language } = this.state;
    const {
      problem: { problem },
    } = this.props;
    const { problem_id: problemId } = problem;
    const { data } = await submitCode({
      problemId,
      language,
      code,
    });
    if (data && data.submitCode) {
      const { record_id: recordId } = data.submitCode;
      router.push({
        pathname: `/submission/${recordId}`,
      });
    }
  };

  render() {
    const { loading, problem } = this.props;
    const { language } = this.state;
    const { problem: target } = problem;
    const difficultyClasses = classNames(styles.difficulty, styles[target.difficulty]);

    const tags = (typeof target.tags === 'string' && target.tags.split(';')) || [];
    const TagsGroup = tags.map(tag => {
      const color = getRandomColor(tag);
      return (
        <Tag key={tag} color={color}>
          {tag}
        </Tag>
      );
    });

    const Description = (
      <div className={styles.description}>
        <span className={difficultyClasses}>{target.difficulty}</span>
        <span>{target.require_time}ms</span>
        <span>{TagsGroup}</span>
      </div>
    );
    const options = {
      mode: languageMapper[language],
      theme: 'xq-light',
      lineNumbers: true,
    };
    return (
      <PageHeaderWrapper title="问题详情" loading={loading}>
        <Card style={{ marginBottom: '1rem' }} bordered={false} loading={loading}>
          <Card.Meta title={target.title} description={Description} />
          <Divider />
          <Markdown className={styles.markdown} source={target.content} />
        </Card>
        <Card bordered={false}>
          <div className={styles.panel}>
            <Select value={language} onChange={this.handleLanguageChange}>
              <Option value="js">JavaScript</Option>
              <Option value="cpp" disabled>
                C++
              </Option>
            </Select>
            <div>
              <Button icon="undo" onClick={this.handleClickResetTemplate}>
                重置模板代码
              </Button>
            </div>
          </div>
          <CodeMirror
            ref={this.codeMirror}
            className={styles.codeMirror}
            value={target.template}
            options={options}
          />
          <div className={styles.submitGroup}>
            <Button onClick={this.handleSubmitCode} type="primary" icon="edit">
              提交
            </Button>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProblemDetail;
