import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, onClickButton }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <div className={styles.button_view}>
      <Button icon="upload" onClick={onClickButton}>
        <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
      </Button>
    </div>
  </Fragment>
);

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  state = {
    avatar_url: '',
  };

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
    this.setState({
      avatar_url: currentUser.avatar_url || '',
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  hanldeUpdateAvatar = () => {
    const { form } = this.props;
    const targetAvatarUrl = form.getFieldsValue(['avatar_url']).avatar_url || '';
    this.setState({
      avatar_url: targetAvatarUrl,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { avatar_url: avatarUrl } = this.state;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('nickname', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.avatar_url' })}>
              {getFieldDecorator('avatar_url', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.avatar_url-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <Button type="primary">
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={avatarUrl} onClickButton={this.hanldeUpdateAvatar} />
        </div>
      </div>
    );
  }
}

export default BaseView;
