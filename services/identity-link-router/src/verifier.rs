use hex;
use crypto::{ed25519};

pub fn verify(message: &[u8], sig: &[u8]) -> bool {
    let public_key = include_str!("../keys/ed25519-public.hex");
    let public_key = hex::decode(public_key).expect("public key should be decoded");

    return ed25519::verify(message, &public_key[..], sig);
}
