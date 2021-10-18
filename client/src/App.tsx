import { Switch, Route, BrowserRouter } from 'react-router-dom';
import HomePage from 'src/pages/HomePage';
import VerifyPage from 'src/pages/VerifyPage';
import { useEffect, useState } from 'react';
import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import { registerGithubRequester } from 'src/_aqua/github-requester';
import { registerTwitterRequester } from 'src/_aqua/twitter-requester';

import 'antd/dist/antd.css';
import './App.css';
import { message } from 'antd';
import { useRecoilState } from 'recoil';
import { requestState } from 'src/state';

const App: React.FC = () => {
  const [connect, setConnect] = useState(false);
  const [requests, setRequests] = useRecoilState(requestState);
  const main = async () => {
    await Fluence.start({ connectTo: krasnodar[0] });

    registerGithubRequester({
      onRequestResult({ code, error, requestId, data }) {
        console.log({ code, error, requestId, data });
        if (code !== 200) {
          message.error(error);
          return;
        }
        setRequests([
          ...requests,
          {
            id: requestId,
            data,
          },
        ]);
      },
      onVerifyResult({ code, error, requestId, data }) {
        console.log({ code, error, requestId, data });

        if (code !== 200) {
          message.error(error);
          return;
        }
        setRequests([
          ...requests,
          {
            id: requestId,
            data,
          },
        ]);
      },
    });

    registerTwitterRequester({
      onRequestResult({ code, error, requestId, data }) {
        console.log({ code, error, requestId, data });
        if (code !== 200) {
          message.error(error);
          return;
        }
        setRequests([
          ...requests,
          {
            id: requestId,
            data,
          },
        ]);
      },
      onVerifyResult({ code, error, requestId, data }) {
        console.log({ code, error, requestId, data });

        if (code !== 200) {
          message.error(error);
          return;
        }
        setRequests([
          ...requests,
          {
            id: requestId,
            data,
          },
        ]);
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
      <Switch>
        <Route path='/verify/:provider' component={VerifyPage} />
        <Route path='/' component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
