use marine_rs_sdk::marine;

#[marine]
pub struct IDRequestResult {
    pub code: u32,
    pub data: IDRequestDataResult,
    pub error: String,
}

#[marine]
pub struct IDRequestDataResult {
    pub challenge_code: String,
}
