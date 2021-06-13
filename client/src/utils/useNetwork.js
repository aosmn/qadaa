import { useEffect, useState } from 'react';
import isOnline from 'is-online';

const useNetwork = () => {
  const [isNetworkOnline, setNetwork] = useState(window.navigator.onLine);
  const updateNetwork = () => {
    (async () => {
      setNetwork((await isOnline()));
    })();
  };
  useEffect(() => {
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);
    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  });
  return isNetworkOnline;
};

export default useNetwork;
