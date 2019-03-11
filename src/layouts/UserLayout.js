import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/panda.svg';
import getPageTitle from '@/utils/getPageTitle';
import Particles from 'react-particles-js';
import particlesConfig from '@/particlesjs-config.json';

const links = [
  {
    key: 'fe',
    title: formatMessage({ id: 'layout.user.link.fe' }),
    href: 'https://github.com/baozi-online-judge/online-judge-fe',
    blankTarget: true,
  },
  {
    key: 'be',
    title: formatMessage({ id: 'layout.user.link.be' }),
    href: 'https://github.com/baozi-online-judge/service-middleware',
    blankTarget: true,
  },
  {
    key: 'github',
    title: formatMessage({ id: 'layout.user.link.github' }),
    href: 'https://github.com/baozi-online-judge',
    blankTarget: true,
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 HeskeyBaozi Graduation Project
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>
                    {`${formatMessage({ id: 'app.home.title' })}`}
                  </span>
                </Link>
              </div>
              <div className={styles.desc}>{`${formatMessage({ id: 'app.description' })}`}</div>
            </div>
            {children}
          </div>
          <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
          <Particles className={styles.particles} params={particlesConfig} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
