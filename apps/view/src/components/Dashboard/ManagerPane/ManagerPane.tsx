import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import NowrapTypo from '@/view/common/components/NowrapTypo';
import { useSelector } from '@/view/hooks/useSelector';
import { ApplicationState } from '@/view/store';
import { loadDomains } from '@/view/store/actions/loader/loadDomains';
import styled from '@emotion/styled';
import { Dns } from '@mui/icons-material';
import { Divider, Portal } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';
import DomainManager from './DomainManager/DomainManager';
import DomainsList from './DomainsList/DomainsList';
import { useParams } from 'react-router';

export const meta: IMenuEntry = {
  order: 2,
  icon: <Dns />,
  label: 'Manage domains',
  path: '/manage',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

const Root = styled.div`
  padding: 2rem;
`;

const connector = connect(
  (state: ApplicationState) => ({
    domain: state.domain.domain,
  }),
  {
    loadDomains,
  },
);

function ManagerPane({
  domain,
  loadDomains,
}: ConnectedProps<typeof connector>) {
  const container = useSelector('#main')[0];
  const { domainId } = useParams();

  const domainPath = domainId ? (
    <>
      &nbsp;/&nbsp;<b>{domain?.domain}</b>
    </>
  ) : (
    ''
  );

  useEffect(() => {
    loadDomains();
  }, []);

  return (
    <Portal container={container}>
      <Root>
        <NowrapTypo
          variant="h4"
          maxWidth="100%"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          Manage domains{domainPath}
        </NowrapTypo>

        <br />

        <Divider />

        <br />

        <DomainManager />
        <DomainsList />
      </Root>
    </Portal>
  );
}

export default connector(ManagerPane);
