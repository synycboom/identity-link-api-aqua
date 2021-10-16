use marine_rs_sdk::marine;
use serde::{Serialize, Deserialize};

#[marine]
#[derive(Serialize, Deserialize, Debug)]
pub struct ServiceRegistrationPayload {
    pub service_id: String,
    pub peer_id: String,
    pub relay_peer_id: String,
}

#[marine]
#[derive(Debug)]
pub struct ServiceRoutingReponse {
    pub code: u32,
    pub error: String,
    pub routing: ServiceRegistrationPayload,
}

#[marine]
#[derive(Debug)]
pub struct ServiceRegistrationRequest {
    pub payload: String,
    pub signature: String,
}

#[marine]
#[derive(Debug)]
pub struct ServiceRegistrationResponse {
    pub code: u32,
    pub error: String,
}
