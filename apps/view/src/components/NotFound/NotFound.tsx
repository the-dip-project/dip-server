import Flexbox from '@/view/common/components/Flexbox';
import { useSelector } from '@/view/hooks/useSelector';
import styled from '@emotion/styled';
import { Portal, Typography } from '@mui/material';

const Root = styled(Flexbox)`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  -ms-flex-direction: row;
  width: 100%;
  height: 100%;
`;

const Divider = styled.div`
  width: 2px;
  height: 4rem;
  background-color: #9a9a9a;
  margin: 0 2rem;
`;

function NotFound() {
  const container = useSelector('#main')[0];

  return (
    <Portal container={container}>
      <Root>
        <Typography variant="h3" fontWeight="bold">
          404
        </Typography>

        <Divider />

        <Typography variant="h4">Page not found</Typography>
      </Root>
    </Portal>
  );
}

export default NotFound;
