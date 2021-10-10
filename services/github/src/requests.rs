use marine_rs_sdk::marine;

#[marine]
#[derive(Debug)]
pub struct IDRequest {
    pub did: String,
    pub username: String,
}
