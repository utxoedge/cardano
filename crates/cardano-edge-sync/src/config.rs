use std::{env, path::PathBuf};

use miette::{Context, IntoDiagnostic};

pub struct Config {
    pub dolos_endpoint: String,
    pub cursor_path: PathBuf,
    pub cloudflare_token: String,
}

impl Config {
    pub fn new() -> miette::Result<Self> {
        let _ = dotenvy::dotenv().ok();

        let dolos_endpoint = env::var("DOLOS_ENDPOINT")
            .into_diagnostic()
            .context("getting dolos endpoint")?;

        let cursor_path = env::var("SYNC_CURSOR")
            .into_diagnostic()
            .context("getting cursor path")?
            .into();

        let cloudflare_token = env::var("CLOUDFLARE_API_TOKEN")
            .into_diagnostic()
            .context("getting cloudflare token")?;

        Ok(Self {
            dolos_endpoint,
            cursor_path,
            cloudflare_token,
        })
    }
}
