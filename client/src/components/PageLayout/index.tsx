import { Layout, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import ConnectButton from 'src/components/ConnectButton';
import LayoutStyle from './style';

const { Content } = Layout;

const PageLayout: React.FC = ({ children }) => {
  return (
    <LayoutStyle>
      <Layout>
        <PageHeader
          title={<Link to='/'>My.ID</Link>}
          // subTitle='Identity Link'
          extra={[<ConnectButton key='1' />]}
        ></PageHeader>
        <Content>
          <div className='container'>{children}</div>
        </Content>
      </Layout>
    </LayoutStyle>
  );
};

export default PageLayout;
