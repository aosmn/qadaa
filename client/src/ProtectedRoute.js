import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!rest.userInfo?.user?.token;
  // const history = useHistory();

  // useEffect(() => {
  //   console.log(rest);
  //   if (!isAuthenticated) {
  //     history.push('/login');
  //   }
  // }, [isAuthenticated, rest, history]);

  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to='/login' />
        );
      }}
    />
  );
};

export default connect(mapStateToProps)(ProtectedRoute);
