import { RCLASS, RTYPE, TYPE } from '@/common/constants/dns-spec';
import { RecordEntity } from '@/common/entities';
import { Edit } from '@mui/icons-material';
import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material';

interface IProps {
  record: RecordEntity;
  selected: boolean;
  onSelectionChanged: (selected: boolean) => void;
}

function parseRecordData(record: RecordEntity): string {
  switch (record.type) {
    case TYPE.A:
    case TYPE.AAAA:
    case TYPE.CNAME:
      return record.data;

    case TYPE.MX: {
      const priority = record.extendedData;
      return `${priority} ${record.data}`;
    }
  }
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
      <TableCell>{parseRecordData(record)}</TableCell>

      <TableCell style={{ borderLeft: '1px solid lightgray' }}>
        <IconButton color="primary" size="small">
          <Edit />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default RecordsItem;
