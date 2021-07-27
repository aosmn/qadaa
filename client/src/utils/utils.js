export const objectEmpty = obj => {
  return (
    obj && // 👈 null and undefined check
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
  );
};

export const validPassword = value => {
  const regex = /((?=.*[a-z])(?=.*[0-9])(?=.{6,}))/;
  return value.match(regex);
};

export const isOnline = function () {
  // IE vs. standard XHR creation
  var x = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP'),
    s;
  x.open(
    // requesting the headers is faster, and just enough
    'HEAD',
    // append a random string to the current hostname,
    // to make sure we're not hitting the cache
    '//' + window.location.hostname + '/?rand=' + Math.random(),
    // make a synchronous request
    false
  );
  try {
    x.send();
    s = x.status;
    // Make sure the server is reachable
    // console.log('henaaa', (s >= 200 && s < 300) || s === 304);
    return (s >= 200 && s < 300) || s === 304;
    // catch network & other problems
  } catch (e) {
    return false;
  }
};
