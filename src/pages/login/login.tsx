import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { isLoadingAuthSelector, login } from '../../services/slices/authSlice';
import { errorAuthSelector } from '../../services/slices/authSlice';
import { Preloader } from '@ui';


export const Login: FC = () => {
  const dispatch = useDispatch()
  const error = useSelector(errorAuthSelector)
  const errorMessage = error?.toString() || ''
  const isAuthDataLoading = useSelector(isLoadingAuthSelector)

  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(login({ email, password }))
  };

  if (isAuthDataLoading) {
    return <Preloader />
  }

  return (
    <LoginUI
      errorText={errorMessage}
      email={email}
      setEmail={setemail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
