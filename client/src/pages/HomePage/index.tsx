import { Link } from 'react-router-dom';
import { Typography, List, Button } from 'antd';
import HomePageStyle from './style';
import PageLayout from 'src/components/PageLayout';
import { useRecoilValue } from 'recoil';
import { accountState } from 'src/state';

const { Title } = Typography;

const HomePage: React.FC = () => {
  const { connected } = useRecoilValue(accountState);

  return (
    <HomePageStyle>
      <PageLayout>
        <Title>My social accounts</Title>
        {connected ? (
          <List
            dataSource={[
              { id: 1, provider: 'Github', link: '', account: 'manotien' },
              { id: 2, provider: 'Twitter', link: '', account: 'manotien' },
            ]}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={<img src={`/${item.provider}.svg`} />}
                  title={item.provider}
                  description={
                    false ? (
                      <a href={item.link} target='_blank'>
                        {item.account}
                      </a>
                    ) : (
                      <p>not linked</p>
                    )
                  }
                />
                <Link to={`/verify/${item.provider.toLowerCase()}`}>
                  <Button>Link Account</Button>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <>Please connect to wallet</>
        )}
      </PageLayout>
    </HomePageStyle>
  );
};

export default HomePage;
