import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const hasMobile = false;
const hasForgetPassword = false;
const hasOtherMethods = false;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      const { userId, password } = values;
      dispatch({
        type: 'login/login',
        payload: {
          userId,
          password,
          rememberMe: autoLogin,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="userId"
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          {hasMobile ? (
            <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
              {login.status === 'error' &&
                login.type === 'mobile' &&
                !submitting &&
                this.renderMessage(
                  formatMessage({ id: 'app.login.message-invalid-verification-code' })
                )}
              <Mobile
                name="mobile"
                placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.phone-number.required' }),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                countDown={120}
                onGetCaptcha={this.onGetCaptcha}
                getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
                getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.verification-code.required' }),
                  },
                ]}
              />
            </Tab>
          ) : null}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            {hasForgetPassword ? (
              <a style={{ float: 'right' }} href="">
                <FormattedMessage id="app.login.forgot-password" />
              </a>
            ) : null}
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div className={styles.other}>
            {hasOtherMethods ? (
              <>
                <FormattedMessage id="app.login.sign-in-with" />
                <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
                <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
                <Icon type="weibo-circle" className={styles.icon} theme="outlined" />{' '}
              </>
            ) : null}
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
