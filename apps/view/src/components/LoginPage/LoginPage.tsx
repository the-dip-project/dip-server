import styled from '@emotion/styled';
import { Box, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import LoginForm from './LoginForm/LoginForm';

const backgrounds = [
  '/public/images/login_background_hd.jpg',
  '/public/images/login_background_2k.jpg',
  '/public/images/login_background_4k.jpg',
];

const bg2ScreenSize = [0, 1300, 2000];

let background: string;

for (let i = 0; i < bg2ScreenSize.length; i++) {
  if (bg2ScreenSize[i] > innerWidth) {
    background = backgrounds[i];
    break;
  }
}

if (!background) background = backgrounds[2];

const Root = styled(Box)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  display: flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  background-image: url(${background});
  background-size: cover;
`;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    height: '54%',
    '& > div': {
      width: '50%',
      height: '100%',
      padding: theme.spacing(0, 3.5),
      display: 'flex',
      flexDirection: 'row',
    },
    [theme.breakpoints.down('md')]: {
      height: '100%',
      '& > div': {
        width: '100%',
        height: '100%',
        padding: 0,
      },
    },
  },
  loginFormContainer: {
    height: '100%',
    justifyContent: 'flex-end',
  },
  logoContainer: {
    justifyContent: 'flex-start',
  },
}));

function LoginPage() {
  const classes = useStyles();

  return (
    <Root>
      <div className={classes.container}>
        <div className={classes.loginFormContainer}>
          <LoginForm />
        </div>
      </div>
    </Root>
  );
}

export default LoginPage;
