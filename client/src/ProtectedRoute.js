import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!JSON.parse(localStorage.getItem('user'))?.token;
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, []);

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default ProtectedRoute;
