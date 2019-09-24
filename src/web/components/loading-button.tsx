import React, { FC } from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
  },
});

export const LoadingButton: FC<{ isLoading?: boolean } & ButtonProps> = ({
  isLoading,
  children,
  ...buttonProps
}) => {
  const classes = useStyles();
  return (
    <Button disabled={isLoading} {...buttonProps}>
      <div className={classes.container}>
        <span style={isLoading ? { visibility: 'hidden' } : undefined}>{children}</span>
        {isLoading && <CircularProgress className={classes.progress} color="secondary" size={24} />}
      </div>
    </Button>
  );
};
