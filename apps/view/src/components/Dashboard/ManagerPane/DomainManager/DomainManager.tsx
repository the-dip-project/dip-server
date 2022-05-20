import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { RecordEntity } from '@/common/entities';
import { ApplicationState } from '@/view/store';
import { notify } from '@/view/store/actions/app/notify';
import {
  loadDomain,
  LoadDomainResult,
} from '@/view/store/actions/loader/loadDomain';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { loadRecords } from '@/view/store/actions/loader/loadRecords';

const RootPaper = styled(Paper)`
  padding: 1rem 1rem;
  &.hide {
    display: none;
  }
`;

const connector = connect(
  (state: ApplicationState) => ({
    domain: state.domain.domain,
    records: state.domain.records,
  }),
  {
    notify,
    loadDomain,
    loadRecords,
  },
);

function DomainManager({
  domain,
  records,
  notify,
  loadDomain,
  loadRecords,
}: ConnectedProps<typeof connector>) {
  const navigate = useNavigate();
  const { domainId: _domainId } = useParams();

  useEffect(() => {
    (async () => {
      if (!_domainId) return;

      const domainId = Number(_domainId);

      if (Number.isNaN(domainId)) return navigate('/manage');

      const loadDomainResult = await loadDomain(Number(domainId));

      switch (loadDomainResult) {
        case LoadDomainResult.CAN_NOT_ACCESS:
          return navigate('/manage');

        case LoadDomainResult.INTERNAL_SERVER_ERROR:
          return notify('Internal server error', NotificationSeverity.ERROR);

        case LoadDomainResult.INVALID_DOMAIN:
          return (
            notify('Invalid domain', NotificationSeverity.WARNING),
            navigate('/manage')
          );

        case LoadDomainResult.LOGGED_OUT:
          return navigate('/login');

        default:
          break;
      }

      // const loadRecordsResult = await loadRecords(domain.id);
    })();
  }, [_domainId]);

  return (
    <>
      <RootPaper className={clsx({ hide: !_domainId })}>
        <Typography variant="h6">
          Created at&nbsp;
          {new Date(domain?.creationDate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
          &nbsp;-&nbsp;{records.length} records associated
        </Typography>
      </RootPaper>
    </>
  );
}

export default connector(DomainManager);
