import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';

import Flexbox from '@/view/common/components/Flexbox';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import DomainAdder from './DomainAdder/DomainAdder';
import DomainsItem from './DomainsItem/DomainsItem';
import clsx from 'clsx';

const Root = styled(Paper)`
  padding: 1rem 1rem;
  margin-top: 2rem;
  &.hide {
    display: none;
    margin: 0;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  /* width */
  &::-webkit-scrollbar {
    height: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Overhead = styled(Flexbox)`
  flex-direction: row;
  -ms-flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem 0;
`;

const connector = connect(
  (state: ApplicationState) => ({
    domains: state.domain.domains,
  }),
  {},
);

function DomainsList({ domains }: ConnectedProps<typeof connector>) {
  const { domain: name } = useParams();
  const [selections, setSelections] = useState(new Set<number>());

  return (
    <>
      <Root className={clsx({ hide: !!name })}>
        <DomainAdder />
      </Root>

      <Root className={clsx({ hide: !!name })}>
        <Overhead>
          <Button size="small" variant="contained" color="error">
            <Delete />
            &nbsp;&nbsp;delete selected
          </Button>
        </Overhead>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                  <Checkbox
                    checked={
                      selections.size !== 0 &&
                      selections.size === domains.length
                    }
                    indeterminate={
                      selections.size !== 0 &&
                      selections.size !== domains.length
                    }
                    onChange={(e) =>
                      e.target.checked
                        ? setSelections(
                            new Set(domains.map((domain) => domain.id)),
                          )
                        : setSelections(new Set())
                    }
                  />
                </TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                  Records
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {domains.map((domain) => (
                <DomainsItem
                  key={`domain#${domain.id}`}
                  domain={domain}
                  selected={selections.has(domain.id)}
                  onSelectionChanged={(selected) => {
                    if (selected) selections.add(domain.id);
                    else selections.delete(domain.id);

                    setSelections(new Set(selections));
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Root>
    </>
  );
}

export default connector(DomainsList);
