import React, { FC, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';

import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { SignupDialog } from './signup-dialog';
// import Login, { LoginForm } from '../Login';
// import { Mode } from '../Login/types';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  loginButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
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

const navTabs: { label: string; href: string }[] = [
  { label: 'Wiki', href: '/wiki' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Challenges', href: '/challenges' },
];

export const Header: FC<{}> = () => {
  const classes = useStyles();
  const router = useRouter();

  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);

  const tabIdx = navTabs.findIndex(({ href }) => href === router.route);

  return (
    <>
      <AppBar>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            <Link href="/" passHref>
              <MuiLink color="inherit">Alg.Wiki</MuiLink>
            </Link>
          </Typography>

          <Tabs value={tabIdx === -1 ? false : tabIdx} aria-label="Navigation links">
            {navTabs.map(({ label, href }, i) => (
              <NavLink key={i} label={label} href={href} />
            ))}
          </Tabs>

          <Button
            color="inherit"
            className={classes.loginButton}
            // onClick={() => this.setState({ loginDialogMode: Mode.Login })}
          >
            Log In
          </Button>
          <Button
            color="secondary"
            variant="contained"
            // onClick={() =>
            //   this.setState({
            //     loginDialogMode: Mode.Signup,
            //   })
            // }
            onClick={async () => {
              setIsSignupDialogOpen(true);
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
      <SignupDialog
        isOpen={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
        onSubmit={() => {}}
        isSubmitting={false}
      />
    </>
  );
};
