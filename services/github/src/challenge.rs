use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Challenge {
    pub challenge_code: String,
    pub did: String,
    pub username: String,
    pub timestamp: DateTime<Utc>,
}
