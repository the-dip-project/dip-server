import clsx from 'clsx';
import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { NotificationSeverity } from '@/view/common/types/Notification';
import { ApplicationState } from '@/view/store';
import { notify } from '@/view/store/actions/app/notify';
import {
  loadDomain,
  LoadDomainResult,
} from '@/view/store/actions/loader/loadDomain';
import {
  loadRecords,
  LoadRecordsResult,
} from '@/view/store/actions/loader/loadRecords';
import styled from '@emotion/styled';
import { Paper, Typography } from '@mui/material';

import RecordAdder from './RecordAdder/RecordAdder';
import RecordsList from './RecordsList/RecordsList';

const Root = styled(Paper)`
  padding: 1rem 1rem;
  margin-top: 2rem;
  &.hide {
    display: none;
    margin: 0;
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
  const { domain: name } = useParams();

  useEffect(() => {
    (async () => {
      if (!name) return;

      const loadDomainResult = await loadDomain(name);

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
    })();
  }, [name]);

  useEffect(() => {
    if (!domain) return;

    (async () => {
      const loadRecordsResult = await loadRecords(domain.id);

      switch (loadRecordsResult) {
        case LoadRecordsResult.INTERNAL_SERVER_ERROR:
          return notify('Internal server error', NotificationSeverity.ERROR);

        case LoadRecordsResult.LOGGED_OUT:
          return navigate('/login');

        default:
          break;
      }
    })();
  }, [domain]);

  return (
    <>
      <Root className={clsx({ hide: !name })}>
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
      </Root>

      <Root className={clsx({ hide: !name })}>
        <RecordAdder />
      </Root>

      <Root className={clsx({ hide: !name })}>
        <RecordsList />
      </Root>
    </>
  );
}

export default connector(DomainManager);
