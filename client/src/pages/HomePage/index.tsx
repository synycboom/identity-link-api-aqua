import { Link } from 'react-router-dom';
import { Typography, List, Button, message } from 'antd';
import HomePageStyle from './style';
import PageLayout from 'src/components/PageLayout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState, socialDataState, socialJWTState } from 'src/state';
import { setStream } from 'src/helpers/stream';
import { useState, useEffect } from 'react';
import { verifyJWT } from 'did-jwt';
import { Resolver } from 'did-resolver';

import IdentityLinkDIDResolver from 'src/identity-link-did-resolver';
import config from 'src/identity-link-router.json';
import setting from 'src/setting';

const { Title } = Typography;

type SocialProvider = 'github' | 'twitter';
type SocialType = {
  id: number;
  provider: SocialProvider;
  name: string;
  link: string;
};

const { node: routerPeerId, id: routerServiceId } =
  config.services['identity-link-router'];

const identityLinkResolver = IdentityLinkDIDResolver.getResolver({
  routerPeerId,
  routerServiceId,
  identityLinkDIDServiceId: setting.REACT_APP_IDENTITY_LINK_DID_SERVICE_ID,
});

const didResolver = new Resolver(identityLinkResolver);

const HomePage: React.FC = () => {
  const { connected, did } = useRecoilValue(accountState);
  const socialData = useRecoilValue(socialDataState);
  const [socialJWT, setSocialJWT] = useRecoilState(socialJWTState);
  const [loadingBtn, setLoadingBtn] = useState('');

  const unlinkAccount = async (provider: SocialProvider) => {
    setLoadingBtn(provider);
    const newSocialJWT = {
      ...socialJWT,
      [provider]: '',
    };
    await setStream(did!, newSocialJWT);
    setSocialJWT(newSocialJWT);
    setLoadingBtn('');
    message.success('Unlink success!', 2);
  };

  useEffect(() => {
    Object.entries(socialJWT).forEach(async ([provider, jwt]) => {
      if (!jwt) return;

      try {
        await verifyJWT(jwt, {
          resolver: didResolver,
        });
      } catch (err: any) {
        if (
          err.message.includes('invalid_jwt') ||
          err.message.includes('invalid_signature')
        ) {
          unlinkAccount(provider as SocialProvider);
          return;
        }

        console.error(err);
      }
    });
  }, [socialJWT]);

  return (
    <HomePageStyle>
      <PageLayout>
        <Title>My social accounts</Title>
        {connected ? (
          <List
            dataSource={[
              {
                id: 1,
                provider: 'github',
                name: 'Github',
                link: 'https://github.com/',
              },
              {
                id: 2,
                provider: 'twitter',
                name: 'Twitter',
                link: 'https://twitter.com/',
              },
            ]}
            renderItem={(item: SocialType) => {
              const provider = item.provider;
              const data = socialData[provider];
              return (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={<img src={`/${provider}.svg`} />}
                    title={item.name}
                    description={
                      data ? (
                        <a
                          href={`${item.link}${data.username}`}
                          target='_blank'
                        >
                          {data.username}
                        </a>
                      ) : (
                        <p>not linked</p>
                      )
                    }
                  />
                  {data ? (
                    <Button
                      danger
                      onClick={() => unlinkAccount(provider)}
                      loading={loadingBtn === provider}
                    >
                      Unlink Account
                    </Button>
                  ) : (
                    <Link to={`/verify/${provider}`}>
                      <Button>Link Account</Button>
                    </Link>
                  )}
                </List.Item>
              );
            }}
          />
        ) : (
          <>Please connect to wallet</>
        )}
      </PageLayout>
    </HomePageStyle>
  );
};

export default HomePage;
