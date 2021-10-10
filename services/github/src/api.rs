use rand::{distributions::Alphanumeric, Rng};
use marine_rs_sdk::marine;
use chrono::{Utc};
use crate::results::{IDRequestResult, IDRequestDataResult};
use crate::requests::{IDRequest};
use crate::challenge::{Challenge};
use crate::sql;

fn generate_challenge_code() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(32)
        .map(char::from)
        .collect()
}

#[marine]
fn request(req: IDRequest) -> IDRequestResult {
    log::info!("[request]: got a new request {:#?}\n", req);

    let mut res = IDRequestResult{
        code: 0,
        data: IDRequestDataResult{
            challenge_code: String::from(""),
        },
        error: String::from(""),
    };
    if req.username == "" {
        res.code = 400;
        res.error = String::from("username is required");

        return res;
    }
    if req.did == "" {
        res.code = 400;
        res.error = String::from("did is required");

        return res;
    }

    let username = &req.username;
    let challenge_code = generate_challenge_code();
    let challenge = Challenge{
        challenge_code: challenge_code.to_string(),
        did: req.did,
        username: username.to_string(),
        timestamp: Utc::now(),
    };

    let mgr;
    match sql::Manager::create() {
        Ok(m) => mgr = m,
        Err(err) => {
            log::error!("[request]: failed to create a manager {}\n", err);
            res.code = 500;
            res.error = String::from("internal service error");

            return res;
        }
    }

    match mgr.initialize_table() {
        Ok(_) => {},
        Err(err) => {
            log::error!("[request]: failed to initialize a table {}\n", err);
            res.code = 500;
            res.error = String::from("internal service error");

            return res;
        }
    }

    match mgr.upsert_challenge(&challenge) {
        Ok(_) => {},
        Err(err) => {
            log::error!("[request]: failed to upsert a challenge {}\n", err);
            res.code = 500;
            res.error = String::from("internal service error");

            return res;
        }
    }

    res.code = 200;
    res.data.challenge_code = challenge.challenge_code;

    return res;
}
