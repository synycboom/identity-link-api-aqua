import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import HomePage from 'src/pages/HomePage';
import VerifyPage from 'src/pages/VerifyPage';

import 'antd/dist/antd.css';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path='/verify/:provider' component={VerifyPage} />
          <Route path='/abc' component={HomePage} />
          <Route path='/' component={HomePage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
