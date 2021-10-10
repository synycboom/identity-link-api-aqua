mod api;
mod results;
mod requests;
mod challenge;
mod sql;
mod tests;

use marine_rs_sdk::{module_manifest, WasmLoggerBuilder};

module_manifest!();

pub fn main() {
    WasmLoggerBuilder::new()
        .with_log_level(log::LevelFilter::Info)
        .build()
        .unwrap();
}
