/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.3.2-233
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    ResultCodes,
    RequestFlow,
    RequestFlowBuilder,
    CallParams
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v1';


function missingFields(obj: any, fields: string[]): string[] {
    return fields.filter(f => !(f in obj))
}

// Services

export interface GithubRequesterDef {
    onRequestResult: (res: { code: number; data: { challengeCode: string; }; error: string; requestId: string; }, callParams: CallParams<'res'>) => void;
onVerifyResult: (res: { code: number; data: { attestation: string; }; error: string; requestId: string; }, callParams: CallParams<'res'>) => void;
}
export function registerGithubRequester(service: GithubRequesterDef): void;
export function registerGithubRequester(serviceId: string, service: GithubRequesterDef): void;
export function registerGithubRequester(peer: FluencePeer, service: GithubRequesterDef): void;
export function registerGithubRequester(peer: FluencePeer, serviceId: string, service: GithubRequesterDef): void;
       

export function registerGithubRequester(...args: any) {
    let peer: FluencePeer;
    let serviceId: any;
    let service: any;
    if (FluencePeer.isInstance(args[0])) {
        peer = args[0];
    } else {
        peer = Fluence.getPeer();
    }

    if (typeof args[0] === 'string') {
        serviceId = args[0];
    } else if (typeof args[1] === 'string') {
        serviceId = args[1];
    } else {
        serviceId = "github-requester"
    }

    // Figuring out which overload is the service.
    // If the first argument is not Fluence Peer and it is an object, then it can only be the service def
    // If the first argument is peer, we are checking further. The second argument might either be
    // an object, that it must be the service object
    // or a string, which is the service id. In that case the service is the third argument
    if (!(FluencePeer.isInstance(args[0])) && typeof args[0] === 'object') {
        service = args[0];
    } else if (typeof args[1] === 'object') {
        service = args[1];
    } else {
        service = args[2];
    }

    const incorrectServiceDefinitions = missingFields(service, ['onRequestResult', 'onVerifyResult']);
    if (!!incorrectServiceDefinitions.length) {
        throw new Error("Error registering service GithubRequester: missing functions: " + incorrectServiceDefinitions.map((d) => "'" + d + "'").join(", "))
    }

    peer.internals.callServiceHandler.use((req, resp, next) => {
        if (req.serviceId !== serviceId) {
            next();
            return;
        }

        if (req.fnName === 'onRequestResult') {
            const callParams = {
                ...req.particleContext,
                tetraplets: {
                    res: req.tetraplets[0]
                },
            };
            resp.retCode = ResultCodes.success;
            service.onRequestResult(req.args[0], callParams); resp.result = {}
        }

if (req.fnName === 'onVerifyResult') {
            const callParams = {
                ...req.particleContext,
                tetraplets: {
                    res: req.tetraplets[0]
                },
            };
            resp.retCode = ResultCodes.success;
            service.onVerifyResult(req.args[0], callParams); resp.result = {}
        }

        next();
    });
}
      
// Functions

