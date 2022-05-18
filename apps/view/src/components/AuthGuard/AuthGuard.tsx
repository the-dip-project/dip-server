import { ResponseDTO } from '@/common/models/dto/response.dto';
import { PublicUser } from '@/common/models/public-user';
import { setUser } from '@/view/store/actions/app/setUser';
import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router';
import { Navigate } from 'react-router';

const connector = connect(() => ({}), {
  setUser,
});

async function fetchUser(): Promise<ResponseDTO<PublicUser>> {
  return await fetch('/api/user/me').then((res) => res.json());
}

function AuthGuard({ setUser }: ConnectedProps<typeof connector>) {
  const [needLogin, setNeedLogin] = useState(-1);
  const location = useLocation();
  const isInLoginPage = !!window.location.pathname.match(/^\/login/);

  useEffect(() => {
    (async () => {
      const { statusCode, body } = await fetchUser();

      const hasError = statusCode > 399 && statusCode < 500; // 4xx

      if (hasError && !isInLoginPage) setNeedLogin(1);
      if (!hasError && isInLoginPage) setNeedLogin(0);

      setUser(body ?? null);
    })();
  }, [location]);

  useEffect(() => {
    if (needLogin !== -1) setNeedLogin(-1);
  }, [needLogin]);

  if (isInLoginPage && needLogin === 0) return <Navigate to="/" />;
  if (!isInLoginPage && needLogin === 1) return <Navigate to="/login" />;
  return null;
}

export default connector(AuthGuard);
