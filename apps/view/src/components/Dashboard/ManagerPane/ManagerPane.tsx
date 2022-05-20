import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';

import { DomainListItem } from '@/common/models/domain-list-item';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import NowrapTypo from '@/view/common/components/NowrapTypo';
import { useSelector } from '@/view/hooks/useSelector';
import { setDomains } from '@/view/store/actions/domain/setDomains';
import styled from '@emotion/styled';
import { Dns } from '@mui/icons-material';
import { Divider, Portal } from '@mui/material';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';
import DomainManager from './DomainManager/DomainManager';
import DomainsList from './DomainsList/DomainsList';

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

const connector = connect(() => ({}), { setDomains });

function ManagerPane({ setDomains }: ConnectedProps<typeof connector>) {
  const container = useSelector('#main')[0];
  const { domain } = useParams();

  const domainPath = domain ? (
    <>
      &nbsp;/&nbsp;<b>{domain}</b>
    </>
  ) : (
    ''
  );

  useEffect(() => {
    (async () => {
      const { statusCode, body } = (await fetch('/api/domain').then((res) =>
        res.json(),
      )) as ResponseDTO<DomainListItem[]>;

      if (statusCode === HttpStatus.OK) setDomains(body);
    })();
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
