#[cfg(test)]
mod test {
    use marine_rs_sdk_test::marine_test;
    use marine_rs_sdk_test::CallParameters;
    use marine_rs_sdk_test::SecurityTetraplet;

    #[marine_test(config_path = "../Config.toml", modules_dir = "../artifacts")]
    fn test(github: marine_test_env::github::ModuleInterface) {
        assert!(true == true);
    }
}
