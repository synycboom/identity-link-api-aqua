import { useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { accountState, IAccountState } from 'src/state';
import { getOrCreateDid } from 'src/helpers/did';
import wallet from 'src/helpers/wallet';

export const useAccount = (): [
  IAccountState,
  SetterOrUpdater<IAccountState>,
  boolean
] => {
  const [account, setAccount] = useRecoilState(accountState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkConnect() {
      setLoading(true);
      setAccount({
        connected: false,
        address: '',
        did: undefined,
      });

      // check is connect to wallet
      const isConnected = await wallet.getIsConnected();
      if (!isConnected) {
        setLoading(false);
        return;
      }

      const address = await wallet.getAddress();
      const did = await getOrCreateDid(address, wallet.getProvider());
      setAccount({
        connected: true,
        address: address || '',
        did,
      });
      setLoading(false);
    }

    if (!account.connected) checkConnect();
  }, []);

  return [account, setAccount, loading];
};
