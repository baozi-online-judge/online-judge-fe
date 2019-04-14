import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { Component } from 'react';
import { List, Badge, Card, Input, Radio, Tag } from 'antd';
import StandardFormRow from '@/components/StandardFormRow';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './Problems.less';
import { getRandomColor } from '@/utils/tagColors';

const { Search } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ problems, loading }) => ({
  problems,
  loading: loading.models.problems,
}))
class Problems extends Component {
  state = {
    searchText: '',
    difficulty: 'ALL',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'problems/fetch',
    });
  }

  handleSearchTextChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  handleDifficultyChange = e => {
    this.setState({
      difficulty: e.target.value,
    });
  };

  handleClickMeta = pid => () => {
    router.push({
      pathname: `/problem/${pid}`,
    });
  };

  renderItem = (item, index) => (
    <List.Item>
      <List.Item.Meta
        onClick={this.handleClickMeta(item.problem_id)}
        className={styles.listMeta}
        title={`${index + 1}# ${item.title}`}
        description={item.content}
      />
      {this.renderItemContent(item)}
    </List.Item>
  );

  getBadgeInfo = difficulty => {
    switch (difficulty) {
      case 'EASY':
        return {
          status: 'success',
          text: '简单',
        };
      case 'MEDIUM':
        return {
          status: 'warning',
          text: '中等',
        };
      case 'HARD':
        return {
          status: 'error',
          text: '困难',
        };
      default:
        return {
          status: 'default',
          text: '未确定难度',
        };
    }
  };

  handleTagClick = value => () => {
    this.setState({
      searchText: value,
    });
  };

  renderItemContent = item => {
    const { status, text } = this.getBadgeInfo(item.difficulty);
    const tags = (typeof item.tags === 'string' && item.tags.split(';')) || [];
    const TagsGroup = tags.map(tag => {
      const color = getRandomColor(tag);
      return (
        <Tag onClick={this.handleTagClick(tag)} key={tag} color={color}>
          {tag}
        </Tag>
      );
    });
    return (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>{TagsGroup}</div>
        <div className={styles.listContentItem}>
          <Badge status={status} text={text} />
        </div>
      </div>
    );
  };

  render() {
    const { searchText, difficulty } = this.state;
    const { problems, loading } = this.props;
    const list = problems.problems || [];
    return (
      <PageHeaderWrapper title="问题列表">
        <Card bordered={false}>
          <StandardFormRow title="搜索">
            <Search
              placeholder="根据标题、标签搜索题目"
              value={searchText}
              onChange={this.handleSearchTextChange}
              style={{ width: 400 }}
            />
          </StandardFormRow>
          <StandardFormRow title="难度" last>
            <RadioGroup onChange={this.handleDifficultyChange} value={difficulty}>
              <RadioButton value="ALL">全部</RadioButton>
              <RadioButton value="EASY">简单</RadioButton>
              <RadioButton value="MEDIUM">中等</RadioButton>
              <RadioButton value="HARD">困难</RadioButton>
            </RadioGroup>
          </StandardFormRow>
        </Card>
        <Card style={{ marginTop: 24 }}>
          <List
            size="large"
            rowKey="problem_id"
            loading={loading}
            dataSource={list}
            renderItem={this.renderItem}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Problems;
