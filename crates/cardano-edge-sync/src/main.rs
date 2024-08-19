use miette::IntoDiagnostic;
use utxorpc::{spec::sync::BlockRef, CardanoSyncClient, ClientBuilder};

use cardano_edge_sync::{config::Config, cursor::Cursor};

#[tokio::main]
async fn main() -> miette::Result<()> {
    let config = Config::new()?;

    let mut client = ClientBuilder::new()
        .uri(&config.dolos_endpoint)
        .into_diagnostic()?
        .build::<CardanoSyncClient>()
        .await;

    let mut cursor = Cursor::get(&config.cursor_path).await?;

    let intersect = cursor.intersect();

    let mut tip = client.follow_tip(intersect).await.into_diagnostic()?;

    while let Ok(event) = tip.event().await {
        match event {
            utxorpc::TipEvent::Apply(block) => {
                let block = block.parsed.unwrap();

                let body = block.body.unwrap();
                let header = block.header.unwrap();

                let intersect = BlockRef {
                    hash: header.hash,
                    index: header.slot,
                };

                println!("{intersect:#?}");

                cursor.set(intersect).await?;
            }
            utxorpc::TipEvent::Undo(_) => todo!(),
            utxorpc::TipEvent::Reset(block_ref) => {
                println!("{block_ref:#?}")
            }
        }
    }

    Ok(())
}
