import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    {/* <a href="">
      <Button size="large" type="primary">
        <FormattedMessage id="app.register-result.view-mailbox" />
      </Button>
    </a> */}
    <Link to="/user/login">
      <Button size="large">
        <FormattedMessage id="app.register-result.back-home" />
      </Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => {
  let account = '';
  if (location.state) {
    const { userId, nickname } = location.state;
    account = `${nickname}@${userId}`;
  }
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={
        <div className={styles.title}>
          <FormattedMessage id="app.register-result.msg" values={{ account }} />
        </div>
      }
      description={formatMessage({ id: 'app.register-result.description' })}
      actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};

export default RegisterResult;
