/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/.
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.4.1-240
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    CallParams,
    callFunction,
    registerService,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v2';


// Services

export interface IdentityLinkDIDServiceDef {
    getDIDDocument: (did: string, callParams: CallParams<'did'>) => { code: number; data: string; error: string; } | Promise<{ code: number; data: string; error: string; }>;
}
export function registerIdentityLinkDIDService(service: IdentityLinkDIDServiceDef): void;
export function registerIdentityLinkDIDService(serviceId: string, service: IdentityLinkDIDServiceDef): void;
export function registerIdentityLinkDIDService(peer: FluencePeer, service: IdentityLinkDIDServiceDef): void;
export function registerIdentityLinkDIDService(peer: FluencePeer, serviceId: string, service: IdentityLinkDIDServiceDef): void;
       

export function registerIdentityLinkDIDService(...args: any) {
    registerService(
        args,
        {
    "defaultServiceId" : "identity-link-did-service",
    "functions" : [
        {
            "functionName" : "getDIDDocument",
            "argDefs" : [
                {
                    "name" : "did",
                    "argType" : {
                        "tag" : "primitive"
                    }
                }
            ],
            "returnType" : {
                "tag" : "primitive"
            }
        }
    ]
}
    );
}
      
// Functions
export type GetDIDDocumentArgRouter = { identityLinkDIDServiceId: string; routerPeerId: string; routerServiceId: string; } 

export function getDIDDocument(router: GetDIDDocumentArgRouter, did: string, success: (arg0: string, callParams: CallParams<'arg0'>) => void | Promise<void>, error: (arg0: number, arg1: string, callParams: CallParams<'arg0' | 'arg1'>) => void | Promise<void>, config?: {ttl?: number}): Promise<void>;
export function getDIDDocument(peer: FluencePeer, router: GetDIDDocumentArgRouter, did: string, success: (arg0: string, callParams: CallParams<'arg0'>) => void | Promise<void>, error: (arg0: number, arg1: string, callParams: CallParams<'arg0' | 'arg1'>) => void | Promise<void>, config?: {ttl?: number}): Promise<void>;
export function getDIDDocument(...args: any) {

    let script = `
                        (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                           (call %init_peer_id% ("getDataSrv" "router") [] router)
                          )
                          (call %init_peer_id% ("getDataSrv" "did") [] did)
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (xor
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call router.$.routerPeerId! (router.$.routerServiceId! "get_service") [router.$.identityLinkDIDServiceId!] s)
                         )
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                         )
                        )
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (mismatch s.$.code! 200
                        (xor
                         (seq
                          (call -relay- ("op" "noop") [])
                          (xor
                           (call %init_peer_id% ("callbackSrv" "error") [s.$.code! s.$.error!])
                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                          )
                         )
                         (seq
                          (seq
                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                           (call -relay- ("op" "noop") [])
                          )
                          (call s.$.routing.relay_peer_id! ("op" "noop") [])
                         )
                        )
                       )
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call -relay- ("op" "noop") [])
                            (call s.$.routing.relay_peer_id! ("op" "noop") [])
                           )
                           (xor
                            (seq
                             (seq
                              (call -relay- ("op" "noop") [])
                              (call s.$.routing.relay_peer_id! ("op" "noop") [])
                             )
                             (call s.$.routing.peer_id! (s.$.routing.service_id! "getDIDDocument") [did] r)
                            )
                            (seq
                             (seq
                              (seq
                               (call s.$.routing.relay_peer_id! ("op" "noop") [])
                               (call -relay- ("op" "noop") [])
                              )
                              (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                             )
                             (call -relay- ("op" "noop") [])
                            )
                           )
                          )
                          (call s.$.routing.relay_peer_id! ("op" "noop") [])
                         )
                         (call -relay- ("op" "noop") [])
                        )
                        (xor
                         (mismatch r.$.code! 200
                          (xor
                           (seq
                            (seq
                             (call s.$.routing.relay_peer_id! ("op" "noop") [])
                             (call -relay- ("op" "noop") [])
                            )
                            (xor
                             (call %init_peer_id% ("callbackSrv" "error") [r.$.code! r.$.error!])
                             (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 5])
                            )
                           )
                           (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 6])
                          )
                         )
                         (xor
                          (call %init_peer_id% ("callbackSrv" "success") [r.$.data!])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 7])
                         )
                        )
                       )
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 8])
                    )
    `
    return callFunction(
        args,
        {
    "functionName" : "getDIDDocument",
    "returnType" : {
        "tag" : "void"
    },
    "argDefs" : [
        {
            "name" : "router",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "did",
            "argType" : {
                "tag" : "primitive"
            }
        },
        {
            "name" : "success",
            "argType" : {
                "tag" : "callback",
                "callback" : {
                    "argDefs" : [
                        {
                            "name" : "arg0",
                            "argType" : {
                                "tag" : "primitive"
                            }
                        }
                    ],
                    "returnType" : {
                        "tag" : "void"
                    }
                }
            }
        },
        {
            "name" : "error",
            "argType" : {
                "tag" : "callback",
                "callback" : {
                    "argDefs" : [
                        {
                            "name" : "arg0",
                            "argType" : {
                                "tag" : "primitive"
                            }
                        },
                        {
                            "name" : "arg1",
                            "argType" : {
                                "tag" : "primitive"
                            }
                        }
                    ],
                    "returnType" : {
                        "tag" : "void"
                    }
                }
            }
        }
    ],
    "names" : {
        "relay" : "-relay-",
        "getDataSrv" : "getDataSrv",
        "callbackSrv" : "callbackSrv",
        "responseSrv" : "callbackSrv",
        "responseFnName" : "response",
        "errorHandlingSrv" : "errorHandlingSrv",
        "errorFnName" : "error"
    }
},
        script
    )
}
