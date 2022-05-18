import styled from '@emotion/styled';
import { Drawer } from '@mui/material';

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: block;
`;

const Content = styled.div``;

function Dashboard() {
  console.log('Dashboard rendered');
  return (
    <Root>
      <Drawer variant="persistent"></Drawer>

      <Content id="main"></Content>
    </Root>
  );
}

export default Dashboard;
