import TransparentAvatar from '@/view/common/components/TransparentAvatar';
import { useBreakpoints } from '@/view/hooks/useBreakpoints';
import { ChevronLeft, ChevronRight, Speed } from '@mui/icons-material';
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
import clsx from 'clsx';
import { useLocation } from 'react-router';
import UserInfo from './UserInfo/UserInfo';

export const menuFullWidth = 260;

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
    },
    [theme.breakpoints.between(menuFullWidth, 'md')]: {},
    [theme.breakpoints.up('md')]: {
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
}));

function Menu({ open, onClose, onOpen }: IProps) {
  const classes = useStyles();
  const checker = useBreakpoints();
  const location = useLocation();

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
        <ListItemButton
          alignItems="center"
          selected={location.pathname.startsWith('/overview')}
        >
          <ListItemAvatar>
            <TransparentAvatar>
              <Speed />
            </TransparentAvatar>
          </ListItemAvatar>

          <ListItemText
            primary="Overview"
            primaryTypographyProps={{ fontWeight: 'bold' }}
          />
        </ListItemButton>
      </List>

      <Divider />

      <UserInfo />
    </Drawer>
  );
}

export default Menu;
