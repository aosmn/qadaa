import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  userInfo: state.userInfo,
});

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!rest.userInfo?.user?.token;
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }
  }, []);

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default connect(mapStateToProps)(ProtectedRoute);
