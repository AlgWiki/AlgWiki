import React, { FC, useEffect, useState } from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/styles';
import zIndex from '@material-ui/core/styles/zIndex';

import Router from 'next/router';
import { loadingIndicatorDelayMs } from '../../common/config/ui';

const useStyles = makeStyles({
  '@keyframes slideInFromTopWithDelay': {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: zIndex.appBar + 50,
    animationName: '$slideInFromTopWithDelay',
    animationDuration: '250ms',
  },
});

export const PageLoadIndicator: FC<{}> = () => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);
  const [delayTimeout, setDelayTimeout] = useState(0);

  useEffect(() => {
    const evts: [string, () => void][] = [
      ['routeChangeStart', () => setIsLoading(true)],
      ['routeChangeComplete', () => setIsLoading(false)],
      ['routeChangeError', () => setIsLoading(false)],
    ];

    for (const [type, handler] of evts) {
      Router.events.on(type, handler);
    }

    return () => {
      for (const [type, handler] of evts) {
        Router.events.off(type, handler);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      setDelayTimeout((setTimeout(() => {
        setIsIndicatorVisible(true);
      }, loadingIndicatorDelayMs) as unknown) as number);
    } else {
      clearTimeout(delayTimeout);
    }
  }, [isLoading]);

  return isIndicatorVisible ? (
    <div className={classes.container}>
      <LinearProgress color="secondary" />
    </div>
  ) : null;
};
