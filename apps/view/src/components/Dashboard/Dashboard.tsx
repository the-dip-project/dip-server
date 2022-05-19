import { useState } from 'react';

import Flexbox from '@/view/common/components/Flexbox';
import styled from '@emotion/styled';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';

import Menu from './Menu/Menu';
import { breakpoints } from '@/view/constants/breakpoints';

const Root = styled(Flexbox)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  flex-direction: column;
`;

const Container = styled(Flexbox)`
  flex-direction: row;
  flex: 1;
  width: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  height: 100%;
  flex: 1;
  overflow: hidden;
  background-color: #f3f4f5;
`;

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(innerWidth > breakpoints.values.md);

  return (
    <Root>
      {innerWidth <= breakpoints.values.md ? (
        <AppBar position="relative">
          <Toolbar component="div" variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      ) : null}

      <Container>
        <Menu
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          onOpen={() => setOpenMenu(true)}
        />

        <Content id="main"></Content>
      </Container>
    </Root>
  );
}

export default Dashboard;
