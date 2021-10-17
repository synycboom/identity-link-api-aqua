import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import HomePage from 'src/pages/HomePage';
import VerifyPage from 'src/pages/VerifyPage';
import { useEffect, useState } from 'react';
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerGithubRequester } from 'src/_aqua/github-requester';

import 'antd/dist/antd.css';
import './App.css';

const App: React.FC = () => {
  const [connect, setConnect] = useState(false);
  const main = async () => {
    await Fluence.start({ connectTo: krasnodar[0] });

    registerGithubRequester({
      onRequestResult(res) {
        console.log(res);
      },
      onVerifyResult(res) {
        console.log(res);
      },
    });
    setConnect(true);
  };

  useEffect(() => {
    main();
  }, []);

  if (!connect) return null;

  return (
    <BrowserRouter>
      <RecoilRoot>
        <Switch>
          <Route path='/verify/:provider' component={VerifyPage} />
          <Route path='/' component={HomePage} />
        </Switch>
      </RecoilRoot>
    </BrowserRouter>
  );
};

export default App;
