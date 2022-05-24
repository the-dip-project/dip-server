import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import CustomScrollbar from '@/view/common/components/CustomScrollbar';
import Flexbox from '@/view/common/components/Flexbox';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import { Delete } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';

import RecordsItem from './RecordsItem/RecordsItem';

const Header = styled(Flexbox)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const TableContainer = styled(CustomScrollbar)`
  overflow-x: auto;
  width: 100%;
`;

const connector = connect(
  (state: ApplicationState) => ({
    records: state.domain.records,
  }),
  {},
);

function RecordsList({ records }: ConnectedProps<typeof connector>) {
  const [selections, setSelections] = useState<Set<number>>(new Set());

  return (
    <>
      <Toolbar variant="dense">
        <Header>
          <Typography variant="subtitle2" fontWeight="bold">
            Records list
          </Typography>

          <Button color="error" variant="contained">
            <Delete />
            &nbsp;&nbsp;delete selected
          </Button>
        </Header>
      </Toolbar>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                <Checkbox
                  checked={
                    selections.size !== 0 && selections.size === records.length
                  }
                  indeterminate={
                    selections.size !== 0 && selections.size !== records.length
                  }
                  onChange={(e) =>
                    e.target.checked
                      ? setSelections(
                          new Set(records.map((record) => record.id)),
                        )
                      : setSelections(new Set())
                  }
                />
              </TableCell>

              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                Host
              </TableCell>

              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                Type
              </TableCell>

              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                Class
              </TableCell>

              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
                TTL
              </TableCell>

              <TableCell>Value</TableCell>

              <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {records.map((record) => (
              <RecordsItem
                key={`record/${record.id}`}
                record={record}
                selected={selections.has(record.id)}
                onSelectionChanged={(selected) => {
                  if (selected) selections.add(record.id);
                  else selections.delete(record.id);

                  setSelections(new Set(selections));
                }}
              />
            ))}

            {records.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="gray" fontWeight="500">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default connector(RecordsList);
