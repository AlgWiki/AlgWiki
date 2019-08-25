import React, { FC } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
// import Login, { LoginForm } from '../Login';
// import { Mode } from '../Login/types';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const NavLink: FC<{ label: string; href: string }> = ({ label, href }) => (
  <Link href={href} passHref>
    <Tab label={label} />
  </Link>
);

export const Header: FC<{}> = () => {
  const classes = useStyles();
  const router = useRouter();

  const navTabs: { label: string; href: string }[] = [
    { label: 'Wiki', href: '/wiki' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Challenges', href: '/challenges' },
  ];
  const tabIdx = navTabs.findIndex(({ href }) => href === router.route);

  return (
    <AppBar>
      <Toolbar variant="dense">
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.title}>
          <Link href="/" passHref>
            <a>Alg.Wiki</a>
          </Link>
        </Typography>

        <Tabs value={tabIdx === -1 ? false : tabIdx} aria-label="Navigation links">
          {navTabs.map(({ label, href }, i) => (
            <NavLink key={i} label={label} href={href} />
          ))}
        </Tabs>

        <Button
          color="primary"
          // onClick={() => this.setState({ loginDialogMode: Mode.Login })}
        >
          Log In
        </Button>
        <Button
          color="primary"
          variant="contained"
          // onClick={() =>
          //   this.setState({
          //     loginDialogMode: Mode.Signup,
          //   })
          // }
        >
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};
