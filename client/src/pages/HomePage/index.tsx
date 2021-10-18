import { Link } from 'react-router-dom';
import { Typography, List, Button } from 'antd';
import HomePageStyle from './style';
import PageLayout from 'src/components/PageLayout';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState, socialDataState, socialJWTState } from 'src/state';
import { setStream } from 'src/helpers/stream';
import { useState } from 'react';

const { Title } = Typography;

type SocialProvider = 'github' | 'twitter';
type SocialType = {
  id: number;
  provider: SocialProvider;
  name: string;
  link: string;
};

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
  };

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
