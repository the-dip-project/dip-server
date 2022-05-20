import { Link } from 'react-router-dom';

import { DomainListItem } from '@/common/models/domain-list-item';
import NowrapTypo from '@/view/common/components/NowrapTypo';
import { Checkbox, TableCell, TableRow } from '@mui/material';

interface IProps {
  domain: DomainListItem;
  selected: boolean;
  onSelectionChanged: (selected: boolean) => void;
}

function DomainsItem({ domain, selected, onSelectionChanged }: IProps) {
  const createdAt = new Date(domain.creationDate);
  const timeString = `${createdAt.getDate().toString().padStart(2, '0')}/${(
    createdAt.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${createdAt.getFullYear()} ${createdAt
    .getHours()
    .toString()
    .padStart(2, '0')}:${createdAt.getMinutes().toString().padStart(2, '0')}`;

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected}
          onChange={(e) => onSelectionChanged(e.target.checked)}
        />
      </TableCell>
      <TableCell>
        <Link to={domain.domain}>{domain.domain}</Link>
      </TableCell>
      <TableCell>
        <NowrapTypo variant="body2">{timeString}</NowrapTypo>
      </TableCell>
      <TableCell>{domain.records}</TableCell>
    </TableRow>
  );
}

export default DomainsItem;
