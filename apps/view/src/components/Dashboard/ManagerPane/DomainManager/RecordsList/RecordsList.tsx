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
import { connect, ConnectedProps } from 'react-redux';
import RecordsItem from './RecordsItem/RecordsItem';

const Header = styled(Flexbox)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const connector = connect(
  (state: ApplicationState) => ({
    records: state.domain.records,
  }),
  {},
);

function RecordsList({ records }: ConnectedProps<typeof connector>) {
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

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '1px', whiteSpace: 'nowrap' }}>
              <Checkbox />
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
            <RecordsItem key={`record/${record.id}`} record={record} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default connector(RecordsList);
