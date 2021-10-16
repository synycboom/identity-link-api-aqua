import { sign, createPrivateKey } from 'crypto';
import { Fluence } from '@fluencelabs/fluence';
import { UpdateServiceArgReq, updateService } from '@/_aqua/register';
import config from '@/identity-link-router.json';
import logger from '@/logger';
import * as settings from '@/setting';
import { isErrorObject } from '@/type';

const { node: servicePeerId, id: serviceId } =
  config.services['identity-link-router'];
const privateKey = createPrivateKey(settings.ED25519_PRIVATE_KEY_PEM);

export default async function updateRouter() {
  const meta = { updatedAt: new Date() };
  if (!Fluence.getStatus().isConnected) {
    logger.warn(
      '[updateRouter]: the application has not been connected to the peer',
      meta
    );
  }

  const { relayPeerId, peerId } = Fluence.getStatus();
  const payload = JSON.stringify({
    service_id: 'github-identity-link-service',
    peer_id: peerId,
    relay_peer_id: relayPeerId,
  });
  const signature = sign(
    null,
    Buffer.from(payload, 'utf8'),
    privateKey
  ).toString('hex');
  const req: UpdateServiceArgReq = {
    payload,
    signature,
  };

  try {
    const res = await updateService(req, serviceId, servicePeerId);
    if (res.code !== 200) {
      logger.error(
        '[register]: cannot update the router',
        {
          ...res,
        },
        meta
      );

      return;
    }

    logger.info('[register]: route has been updated', meta);
  } catch (err) {
    if (isErrorObject(err)) {
      logger.error(`[register]: cannot call updateService`, {
        ...meta,
        error: err.message,
      });

      return;
    }

    logger.error(`[register]: unknown error; ${err}`, meta);
  }
}
