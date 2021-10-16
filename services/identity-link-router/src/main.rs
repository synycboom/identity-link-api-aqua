mod register;
mod sql;
mod api;
mod verifier;

use marine_rs_sdk::{module_manifest, WasmLoggerBuilder};

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new()
        .with_log_level(log::LevelFilter::Info)
        .build()
        .unwrap();
}
