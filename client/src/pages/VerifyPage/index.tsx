import { useHistory, useParams } from 'react-router-dom';
import { Typography, message, Button, Steps, Input, Space } from 'antd';
import VerifyPageStyle from './style';
import { fromDagJWS } from 'dids/lib/utils';
import PageLayout from 'src/components/PageLayout';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accountState, requestState } from 'src/state';
import { copyTextToClipboard } from 'src/helpers';
import {
  request as requestGithub,
  verify as verifyGithub,
} from 'src/_aqua/github';
import { requestTwitter, verifyTwitter } from 'src/_aqua/twitter';
import config from 'src/identity-link-router.json';
import { Fluence } from '@fluencelabs/fluence';
import setting from 'src/setting';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;
const { Step } = Steps;

const DEFAULT_DATA = {
  requestId: '',
  verifyId: '',
  challengeCode: '',
};

const VerifyPage: React.FC = () => {
  const { provider }: { provider: 'github' | 'twitter' } = useParams();
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [data, setData] = useState(DEFAULT_DATA);
  const { connected, did } = useRecoilValue(accountState);
  const [requests, setRequests] = useRecoilState(requestState);

  const clear = () => {
    setData(DEFAULT_DATA);
    setRequests([]);
  };

  const startRequest = async (
    identityLinkServiceId: string,
    requestFn: any
  ) => {
    const { node: routerPeerId, id: routerServiceId } =
      config.services['identity-link-router'];

    const router = {
      routerPeerId,
      routerServiceId,
      identityLinkServiceId,
    };
    const { peerId, relayPeerId } = Fluence.getStatus();
    const reqPeer = {
      peerId: peerId!,
      relayPeerId: relayPeerId!,
      hasRelayPeer: true,
    };
    const requestId = uuidv4();
    setData({
      ...DEFAULT_DATA,
      requestId,
    });
    const payload = {
      req: { did: did!.id, username },
      requestId,
      reqPeer,
    };
    await requestFn(router, payload);
  };

  const requestCallback = (challengeCode: string) => {
    setData({
      ...data,
      challengeCode,
    });
    copyTextToClipboard(did!.id);
    setLoadingIndex(-1);
    message.success('Copied to clipboard!');
  };

  const startVerify = async (identityLinkServiceId: string, verifyFn: any) => {
    const { node: routerPeerId, id: routerServiceId } =
      config.services['identity-link-router'];

    const router = {
      routerPeerId,
      routerServiceId,
      identityLinkServiceId,
    };
    const { peerId, relayPeerId } = Fluence.getStatus();
    const reqPeer = {
      peerId: peerId!,
      relayPeerId: relayPeerId!,
      hasRelayPeer: true,
    };
    const jws = await did!.createJWS({
      challengeCode: data.challengeCode,
    });
    const requestId = uuidv4();
    setData({
      ...data,
      verifyId: requestId,
    });
    const payload = {
      req: { jws: fromDagJWS(jws) },
      requestId,
      reqPeer,
    };
    await verifyFn(router, payload);
  };

  const verifyCallback = (attestation: string) => {
    console.log(attestation);
    setLoadingIndex(-1);
    clear();
    message.success('Verify succuess!', 2, () => history.push('/'));
  };

  useEffect(() => {
    // request flow
    const requestData = requests.find(
      (_request) => _request.id === data.requestId
    );
    if (requestData) {
      requestCallback(requestData.data.challengeCode);
    }

    // verify flow
    const verifyData = requests.find(
      (_request) => _request.id === data.verifyId
    );
    if (verifyData) {
      verifyCallback(verifyData.data.attestation);
    }
  }, [requests]);

  const SOCIAL_VERIFY_STEPS = {
    github: [
      {
        message: 'Click this button to copy the verification message.',
        button: 'Copy',
        action: async () => {
          setLoadingIndex(0);
          await startRequest(
            setting.REACT_APP_GITHUB_SERVICE_ID,
            requestGithub
          );
          message.loading('Loading challenge...', 1);
        },
      },
      {
        message:
          'Click this button to open a new window and create a Gist file.',
        button: 'Open',
        action: async () => {
          if (window) {
            window.open('https://gist.github.com/', '_blank');
          }
        },
      },
      {
        message: 'Paste your DID in the Gist and save as public.',
        button: 'Continue',
        action: async () => {},
      },
      {
        message:
          'Return to this page and verify your account by clicking this button.',
        button: 'Verify',
        action: async () => {
          setLoadingIndex(3);
          await startVerify(setting.REACT_APP_GITHUB_SERVICE_ID, verifyGithub);
          message.loading('Verify...', 2);
        },
      },
    ],
    twitter: [
      {
        message: 'Click this button to copy the verification message.',
        button: 'Copy',
        action: async () => {
          setLoadingIndex(0);
          await startRequest(
            setting.REACT_APP_TWITTER_SERVICE_ID,
            requestTwitter
          );
          message.loading('Loading challenge...', 1);
        },
      },
      {
        message: `Tweet a verification from @${username}`,
        button: 'Tweet',
        action: async () => {
          if (window) {
            window.open(
              `https://twitter.com/intent/tweet?text=${did!.id}`,
              '_blank'
            );
          }
        },
      },
      {
        message:
          'Return to this page and verify your account by clicking this button.',
        button: 'Verify',
        action: async () => {
          setLoadingIndex(2);
          await startVerify(
            setting.REACT_APP_TWITTER_SERVICE_ID,
            verifyTwitter
          );
          message.loading('Verify...', 2);
        },
      },
    ],
  };

  const nextStep = (index: number) => {
    setStep(index + 1);
  };

  return (
    <VerifyPageStyle>
      <PageLayout>
        <Title>Verify {provider} account</Title>
        {connected ? (
          <>
            <Steps direction='vertical' current={step}>
              <Step
                key={-1}
                title={`Step 1`}
                description={
                  <>
                    <p>Fill social account</p>
                    <Space>
                      <Title level={5}>{provider}.com/</Title>
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <Button
                        danger
                        onClick={() => {
                          if (!username) {
                            message.error('Please fill social account');
                            return;
                          }
                          nextStep(0);
                        }}
                      >
                        Confirm
                      </Button>
                    </Space>
                  </>
                }
              />
              {SOCIAL_VERIFY_STEPS[provider].map((stepItem, index) => (
                <Step
                  key={index}
                  title={`Step ${index + 2}`}
                  description={
                    <>
                      <p>{stepItem.message}</p>
                      {stepItem.button != null && (
                        <Button
                          danger
                          loading={index === loadingIndex}
                          onClick={async () => {
                            await stepItem.action();
                            nextStep(index + 1);
                          }}
                        >
                          {stepItem.button}
                        </Button>
                      )}
                    </>
                  }
                />
              ))}
            </Steps>
          </>
        ) : (
          <>Wait for connected...</>
        )}
      </PageLayout>
    </VerifyPageStyle>
  );
};

export default VerifyPage;
