import { useSelector } from '@/view/hooks/useSelector';
import { Portal } from '@mui/material';

function OverviewPane() {
  const container = useSelector('#main')[0];

  return <Portal container={container}>Overview</Portal>;
}

export default OverviewPane;
