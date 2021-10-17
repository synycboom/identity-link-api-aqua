import { useState } from 'react';
import { Button } from 'antd';
import { useAccount } from 'src/helpers/use';
import { getOrCreateDid } from 'src/helpers/did';
import wallet from 'src/helpers/wallet';
import { defaultAccountState } from 'src/state';

const ConnectButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount, accountLoading] = useAccount();

  const connect = async () => {
    setLoading(true);

    // connect to metamask
    const [address, ethProvider] = await wallet.connect();

    // get or create did
    const did = await getOrCreateDid(address, ethProvider);
    setAccount({
      connected: true,
      address,
      did,
    });
    setLoading(false);
    return true;
  };

  const logout = async () => {
    await wallet.disconnect();
    setAccount(defaultAccountState);
  };

  const formatDid = (did: string): string => {
    const length = did.length;
    return `${did.substring(0, 10)}...${did.substring(length - 6, length)}`;
  };

  const isConnecting = loading || accountLoading;

  return (
    <Button
      type='primary'
      onClick={account.connected ? logout : connect}
      loading={isConnecting}
    >
      {isConnecting
        ? 'Connecting ...'
        : account.connected
        ? formatDid(account.did.id)
        : 'Connect to Wallet'}
    </Button>
  );
};

export default ConnectButton;
