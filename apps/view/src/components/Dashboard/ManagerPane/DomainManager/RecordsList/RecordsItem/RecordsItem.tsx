import { RecordEntity } from '@/common/entities';
import { Edit } from '@mui/icons-material';
import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material';

interface IProps {
  record: RecordEntity;
}

function RecordsItem({ record }: IProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>

      <TableCell align="center">{record.host}</TableCell>
      <TableCell align="center">{record.type}</TableCell>
      <TableCell align="center">{record.class}</TableCell>
      <TableCell align="center">{record.ttl}</TableCell>
      <TableCell>{record.data}</TableCell>
      <TableCell style={{ borderLeft: '1px solid lightgray' }}>
        <IconButton color="primary" size="small">
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default RecordsItem;
