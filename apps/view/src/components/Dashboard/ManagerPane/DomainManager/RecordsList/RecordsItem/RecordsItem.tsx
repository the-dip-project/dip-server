import { RCLASS, RTYPE } from '@/common/constants/dns-spec';
import { RecordEntity } from '@/common/entities';
import { Edit } from '@mui/icons-material';
import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material';

interface IProps {
  record: RecordEntity;
  selected: boolean;
  onSelectionChanged: (selected: boolean) => void;
}

function RecordsItem({ record, selected, onSelectionChanged }: IProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected}
          onChange={(e) => onSelectionChanged(e.target.checked)}
        />
      </TableCell>

      <TableCell align="center">{record.host}</TableCell>
      <TableCell align="center">{RTYPE[record.type]}</TableCell>
      <TableCell align="center">{RCLASS[record.class]}</TableCell>
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
