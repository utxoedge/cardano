use std::{env, path::PathBuf};

use miette::{Context, IntoDiagnostic};
use utxorpc::spec::sync::BlockRef;

const MAX_REFS: usize = 10;

pub struct Cursor {
    path: PathBuf,
    refs: Vec<BlockRef>,
}

impl Cursor {
    pub fn intersect(&self) -> Vec<BlockRef> {
        self.refs.clone()
    }

    pub async fn get(path: &PathBuf) -> miette::Result<Self> {
        let refs = tokio::fs::read(path)
            .await
            .ok()
            .and_then(|data| serde_json::from_slice(&data).ok())
            .unwrap_or(vec![]);

        Ok(Self {
            path: path.clone(),
            refs,
        })
    }

    pub async fn set(&mut self, block_ref: BlockRef) -> miette::Result<()> {
        if self.refs.len() >= MAX_REFS {
            // Remove the first element and rotate the rest
            self.refs.remove(0);
        }

        // Push the new BlockRef
        self.refs.push(block_ref);

        let data = serde_json::to_vec(&self.refs).into_diagnostic()?;

        // Write the updated refs to disk
        tokio::fs::write(&self.path, data)
            .await
            .into_diagnostic()
            .context("writing updated cursor to disk")?;

        Ok(())
    }
}
