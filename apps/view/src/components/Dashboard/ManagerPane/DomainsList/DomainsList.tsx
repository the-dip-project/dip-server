import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useParams } from 'react-router';

import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import DomainsItem from './DomainsItem/DomainsItem';

const Root = styled(Paper)`
  &.hide {
    display: none;
  }
`;

const connector = connect(
  (state: ApplicationState) => ({
    domains: state.domain.domains,
  }),
  {},
);

function DomainsList({ domains }: ConnectedProps<typeof connector>) {
  const { domain } = useParams();
  const [selections, setSelections] = useState(new Set<number>());

  return (
    <Root className={domain ? 'hide' : ''}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={
                  selections.size !== 0 && selections.size === domains.length
                }
                onChange={(e) =>
                  e.target.checked
                    ? setSelections(new Set(domains.map((domain) => domain.id)))
                    : setSelections(new Set())
                }
              />
            </TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Created at</TableCell>
            <TableCell>Records</TableCell>
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
    </Root>
  );
}

export default connector(DomainsList);
