use marine_rs_sdk::marine;
use serde_json;
use crate::sql;
use crate::verifier;
use crate::register::{
    ServiceRegistrationPayload,
    ServiceRegistrationRequest,
    ServiceRegistrationResponse,
    ServiceRoutingReponse
};

#[marine]
fn update_service(req: ServiceRegistrationRequest) -> ServiceRegistrationResponse {
    log::info!("[update_service]: got a new request {:#?}\n", req);

    let mut res = ServiceRegistrationResponse{
        code: 0,
        error: String::from(""),
    };

    let signature;
    if let Ok(h) = hex::decode(req.signature) {
        signature = h;
    } else {
        res.code = 403;
        res.error = String::from("cannot decode a hex string signature");

        return res;
    }

    let message = req.payload.as_bytes();
    if !verifier::verify(message, &signature) {
        res.code = 403;
        res.error = String::from("signature is invalid");

        return res;
    }

    let deserialized: ServiceRegistrationPayload;
    if let Ok(d) = serde_json::from_slice(message) {
        deserialized = d;
    } else {
        res.code = 400;
        res.error = String::from("payload is not deserializeable");

        return res;
    }

    if deserialized.service_id == "" {
        res.code = 400;
        res.error = String::from("service_id is required");

        return res;
    }
    if deserialized.peer_id == "" {
        res.code = 400;
        res.error = String::from("peer_id is required");

        return res;
    }
    if deserialized.relay_peer_id == "" {
        res.code = 400;
        res.error = String::from("relay_peer_id is required");

        return res;
    }

    let mgr;
    match sql::Manager::create() {
        Ok(m) => mgr = m,
        Err(err) => {
            log::error!("[update_service]: failed to create a manager {}\n", err);
            res.code = 500;
            res.error = String::from("internal service error");

            return res;
        }
    }

    if let Err(err) = mgr.initialize_table() {
        log::error!("[update_service]: failed to initialize a table {}\n", err);
        res.code = 500;
        res.error = String::from("internal service error");

        return res;
    }

    if let Err(err) = mgr.upsert_service(&deserialized) {
        log::error!("[update_service]: failed to upsert a challenge {}\n", err);
        res.code = 500;
        res.error = String::from("internal service error");

        return res;
    }

    res.code = 200;

    return res;
}

#[marine]
fn get_service(service_id: String) -> ServiceRoutingReponse {
    let mut res = ServiceRoutingReponse{
        code: 0,
        error: String::from(""),
        routing: ServiceRegistrationPayload{
            service_id: String::from(""),
            peer_id: String::from(""),
            relay_peer_id: String::from(""),
        }
    };

    let mgr;
    match sql::Manager::create() {
        Ok(m) => mgr = m,
        Err(err) => {
            log::error!("[get_service]: failed to create a manager {}\n", err);
            res.code = 500;
            res.error = String::from("internal service error");

            return res;
        }
    }

    if let Err(err) = mgr.initialize_table() {
        log::error!("[get_service]: failed to initialize a table {}\n", err);
        res.code = 500;
        res.error = String::from("internal service error");

        return res;
    }

    match mgr.get_service(&service_id) {
        Ok(service) => {
            res.routing = service;
            res.code = 200;

            return res;
        },
        Err(err) => {
            log::error!("[get_service]: failed to query a service {}\n", err);
            res.code = 500;

            return res;
        },
    }
}