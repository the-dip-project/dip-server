import styled from '@emotion/styled';
import { useState } from 'react';
import Menu from './Menu/Menu';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  display: flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: row;
  align-items: stretch;
`;

const Content = styled.div`
  height: 100%;
  flex: 1;
  padding: 1rem;
`;

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Root>
      <Menu
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onOpen={() => setOpenMenu(true)}
      />

      <Content id="main"></Content>
    </Root>
  );
}

export default Dashboard;
