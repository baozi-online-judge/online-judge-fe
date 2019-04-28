import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import React, { Component } from 'react';
import { Card, List, Input } from 'antd';
import StandardFormRow from '@/components/StandardFormRow';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './Discussions.less';

const { Search } = Input;

@connect(({ discussions, loading }) => ({
  discussions,
  loading: loading.models.discussions,
}))
class Discussions extends Component {
  state = {
    searchText: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'discussions/fetch',
    });
  }

  handleSearchTextChange = e => {
    this.setState({
      searchText: e.target.value,
    });
  };

  handleClickMeta = did => () => {
    router.push({
      pathname: `/discussion/${did}`,
    });
  };

  renderItem = item => (
    <List.Item key={item.discussion_id}>
      <List.Item.Meta
        className={styles.listMeta}
        onClick={this.handleClickMeta(item.discussion_id)}
        title={`${item.discussion_id}# ${item.title}`}
        description={item.content}
      />
      {/* {this.renderItemContent(item)} */}
    </List.Item>
  );

  render() {
    const { searchText } = this.state;
    const { discussions, loading } = this.props;
    const list = discussions.discussions || [];
    return (
      <PageHeaderWrapper title="讨论列表">
        <Card bordered={false} style={{ marginBottom: '1rem' }}>
          <StandardFormRow title="搜索" last>
            <Search
              placeholder="根据标题搜索讨论"
              value={searchText}
              onChange={this.handleSearchTextChange}
              style={{ width: 400 }}
            />
          </StandardFormRow>
        </Card>
        <Card bordered={false}>
          <List
            size="large"
            rowKey="discussion_id"
            loading={loading}
            dataSource={list}
            renderItem={this.renderItem}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Discussions;
