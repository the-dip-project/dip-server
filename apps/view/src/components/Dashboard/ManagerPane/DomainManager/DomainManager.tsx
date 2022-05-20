import { useParams } from 'react-router';

function DomainManager() {
  const { domain } = useParams();

  if (!domain) return null;

  return <></>;
}

export default DomainManager;
