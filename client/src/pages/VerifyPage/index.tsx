import { useHistory, useParams } from 'react-router-dom';
import { Typography, message, Button, Steps, Input, Space } from 'antd';
import VerifyPageStyle from './style';
import { fromDagJWS } from 'dids/lib/utils';
import PageLayout from 'src/components/PageLayout';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accountState } from 'src/state';
import { copyTextToClipboard } from 'src/helpers';

import { request, verify } from 'src/_aqua/github';
import config from 'src/identity-link-router.json';
import { Fluence } from '@fluencelabs/fluence';

const { Title } = Typography;
const { Step } = Steps;

const VerifyPage: React.FC = () => {
  const { provider }: { provider: 'github' | 'twitter' } = useParams();
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const { connected, did } = useRecoilValue(accountState);

  const requestGithub = async () => {
    const { node: routerPeerId, id: routerServiceId } =
      config.services['identity-link-router'];

    const router = {
      routerPeerId,
      routerServiceId,
      identityLinkSerivceId: 'github-identity-link-service',
    };
    const { peerId, relayPeerId } = Fluence.getStatus();
    const reqPeer = {
      peerId: peerId!,
      relayPeerId: relayPeerId!,
      hasRelayPeer: true,
    };
    const payload = {
      req: { did: did!.id, username },
      requestId: 'testabc',
      reqPeer,
    };
    const response = await request(router, payload);
    console.log(response);
  };

  const verifyGithub = async () => {
    const { node: routerPeerId, id: routerServiceId } =
      config.services['identity-link-router'];

    const router = {
      routerPeerId,
      routerServiceId,
      identityLinkSerivceId: 'github-identity-link-service',
    };
    const { peerId, relayPeerId } = Fluence.getStatus();
    const reqPeer = {
      peerId: peerId!,
      relayPeerId: relayPeerId!,
      hasRelayPeer: true,
    };
    const jws = await did!.createJWS({
      challengeCode: 'BJszd65UQy8wWcFJdlfzQjQDYRK074oS',
    });

    const payload = {
      req: { jws: fromDagJWS(jws) },
      requestId: 'testabc',
      reqPeer,
    };
    const response = await verify(router, payload);
    console.log(response);
  };

  const SOCIAL_VERIFY_STEPS = {
    github: [
      {
        message: 'Click this button to copy the verification message.',
        button: 'Copy',
        action: async () => {
          setLoadingIndex(0);
          const hide = message.loading('Loading challenge...', 0);
          await requestGithub();
          hide();
          copyTextToClipboard(did!.id);
          setLoadingIndex(-1);
          message.success('Copied to clipboard!');
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
          const hide = message.loading('Verify...', 0);
          await verifyGithub();
          setTimeout(() => {
            hide();
            setLoadingIndex(-1);
            message.success('Verify succuess!', 2, () => history.push('/'));
          }, 2000);
        },
      },
    ],
    twitter: [
      {
        message: 'Click this button to copy the verification message.',
        button: 'Copy',
        action: async () => {
          setLoadingIndex(0);
          const hide = message.loading('Loading challenge...', 0);
          setTimeout(() => {
            hide();
            setLoadingIndex(-1);
            message.success('Copied to clipboard!');
          }, 2000);
        },
      },
      {
        message: `Tweet a verification from @${'username'}`,
        button: 'Tweet',
        action: async () => {
          if (window) {
            window.open(
              `https://twitter.com/intent/tweet?text=${'did:dsad'}`,
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
          const hide = message.loading('Verify...', 0);
          setTimeout(() => {
            hide();
            setLoadingIndex(-1);
            message.success('Verify succuess!');
            setTimeout(() => {
              history.push('/');
            }, 2000);
          }, 2000);
        },
      },
    ],
  };

  const nextStep = (index: number) => {
    setStep(index + 1);
  };

  useEffect(() => {}, []);

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
                          // disabled={step !== index}
                          onClick={() => {
                            stepItem
                              .action()
                              .then(() => {
                                // setLoadingIndex(-1);
                                nextStep(index + 1);
                              })
                              .catch(() => {
                                message.error('something went wrong');
                              });
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
