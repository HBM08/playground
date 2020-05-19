import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = (history) => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const goToLoginPage = useCallback(() => {
    console.log("in go to login")
    history.push('/login');
  }, [history]);

  // Persisting userId and token in the browser's localStorage
  const login = useCallback((uid, _token, expirationDate) => {
    // You can pass only the first 2 elements here (when calling it from an Auth-like component)
    setToken(_token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 6); //6 hours (can be modified, but must be in sync with the backend)
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: _token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    history.push('/');
  }, [history]);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
    history.push('/');
  }, [history]);

  // Keep the user logged in until his token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  // When using this hook, you can get ahold of any of these:

  return {
    userId,
    token,
    goToLoginPage,
    login,
    logout
  };
}