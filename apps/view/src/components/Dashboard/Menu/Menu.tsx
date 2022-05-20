import clsx from 'clsx';
import { useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

import NowrapTypo from '@/view/common/components/NowrapTypo';
import TransparentAvatar from '@/view/common/components/TransparentAvatar';
import { useBreakpoints } from '@/view/hooks/useBreakpoints';
import { ApplicationState } from '@/view/store';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Divider,
  Drawer,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

import { PaneRegister } from '../Panes';
import UserInfo from './UserInfo/UserInfo';

export const menuFullWidth = 300;

interface IProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      height: '100vh',
      width: '100vw',
      position: 'fixed',
    },
    [theme.breakpoints.up(theme.breakpoints.values.md + 1)]: {
      position: 'relative',
      height: '100%',
    },
  },
  paper: {
    position: 'relative',
    height: '100%',
    [theme.breakpoints.up(menuFullWidth)]: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: `calc(${theme.spacing(9)} + 0px)`,
      '&.open': {
        width: menuFullWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
      },
    },
    [theme.breakpoints.down(menuFullWidth)]: {
      width: '100%',
    },
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    /* width */
    '&::-webkit-scrollbar': {
      width: '4px',
    },

    /* Track */
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  item: {
    color: '#3c3c3c',
  },
}));

const connector = connect(
  (state: ApplicationState) => ({
    role: state.app.user?.role,
  }),
  {},
);

function Menu({
  open,
  onClose,
  onOpen,
  role,
}: IProps & ConnectedProps<typeof connector>) {
  const classes = useStyles();
  const checker = useBreakpoints();
  const location = useLocation();
  const navigate = useNavigate();
  const items = useMemo(
    () =>
      [...PaneRegister.getInstance().getAll()].sort(
        (i1, i2) => i1.order - i2.order,
      ),
    [PaneRegister.getInstance().getAll()],
  );

  return (
    <Drawer
      anchor="left"
      variant={checker.up('md') ? 'permanent' : 'temporary'}
      open={open}
      className={classes.root}
      PaperProps={{ className: clsx(classes.paper, { open }) }}
    >
      <List>
        <ListItemButton onClick={() => (open ? onClose() : onOpen())}>
          <ListItemAvatar>
            <TransparentAvatar>
              {open ? <ChevronLeft /> : <ChevronRight />}
            </TransparentAvatar>
          </ListItemAvatar>
        </ListItemButton>
      </List>

      <Divider />

      <List className={classes.list}>
        {items.map((item) => (
          <ListItemButton
            key={`menu#${item.path}`}
            className={classes.item}
            alignItems="center"
            selected={
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/')
            }
            onClick={() => navigate(item.path)}
            disabled={role > item.minPrivilege}
          >
            <ListItemAvatar>
              <TransparentAvatar>{item.icon}</TransparentAvatar>
            </ListItemAvatar>

            <ListItemText
              primary={<NowrapTypo fontWeight="bold">{item.label}</NowrapTypo>}
              secondary={
                role > item.minPrivilege ? (
                  <NowrapTypo variant="caption">
                    This feature requires higher privilege
                  </NowrapTypo>
                ) : undefined
              }
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <UserInfo />
    </Drawer>
  );
}

export default connector(Menu);
