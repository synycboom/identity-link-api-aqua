import { useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';
import { accountState, IAccountState, socialJWTState } from 'src/state';
import { getOrCreateDid } from 'src/helpers/did';
import wallet from 'src/helpers/wallet';
import { getStream } from 'src/helpers/stream';

export const useAccount = (): [
  IAccountState,
  SetterOrUpdater<IAccountState>,
  boolean
] => {
  const [account, setAccount] = useRecoilState(accountState);
  const [loading, setLoading] = useState(false);
  const setSocialJWT = useSetRecoilState(socialJWTState);

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
      setSocialJWT(await getStream(did));
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
