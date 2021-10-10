use marine_sqlite_connector::{Value, Connection, open};
use crate::challenge::{Challenge};

const DB_PATH: &str = "/tmp/identity-github-link.sqlite";

pub struct Manager {
    pub conn: Connection,
}

impl Manager {
    pub fn create() -> Result<Manager, String> {
        match open(DB_PATH) {
            Ok(conn) => Ok(Manager{
                conn
            }),
            Err(err) => Err(format!("[create]: failed to create a connection {}", err)),
        }
    }

    pub fn initialize_table(&self) -> Result<(), String> {
        let res = self
            .conn
            .execute("
                    CREATE TABLE IF NOT EXISTS indentity (
                        did TEXT NOT NULL PRIMARY KEY,
                        challenge_code TEXT NOT NULL,
                        username TEXT NOT NULL,
                        updated_at DATETIME NOT NULL
                    );
            ");

        match res {
            Ok(_) => Ok(()),
            Err(err) => Err(format!("[initialize_table]: failed to execute a command {}", err)),
        }
    }

    pub fn upsert_challenge(&self, challenge: &Challenge) -> Result<(), String> {
        let s = self.conn
            .prepare("
                INSERT INTO indentity(
                    did,
                    challenge_code,
                    username,
                    updated_at
                ) VALUES(
                    ?,
                    ?,
                    ?,
                    ?
                )
                ON CONFLICT(did)
                DO UPDATE SET
                    challenge_code=excluded.challenge_code,
                    username=excluded.username,
                    updated_at=excluded.updated_at;
            ");

        let mut stmt;
        match s {
            Ok(s) => {
                stmt = s;
            },
            Err(err) => {
                return Err(format!("[upsert_challenge]: failed to prepare a statement {}", err))
            },
        };

        if let Err(err) = stmt.bind(1, &Value::String(challenge.did.to_string())) {
            return Err(format!("[upsert_challenge]: failed to bind 'did' with error {}", err));
        }
        if let Err(err) = stmt.bind(2, &Value::String(challenge.challenge_code.to_string())) {
            return Err(format!("[upsert_challenge]: failed to bind 'challenge_code' with error {}", err));
        }
        if let Err(err) = stmt.bind(3, &Value::String(challenge.username.to_string())) {
            return Err(format!("[upsert_challenge]: failed to bind 'username' with error {}", err));
        }
        if let Err(err) = stmt.bind(4, &Value::String(format!("{:?}", challenge.timestamp))) {
            return Err(format!("[upsert_challenge]: failed to bind 'updated_at' with error {}", err));
        }
        if let Err(err) = stmt.cursor().next() {
            return Err(format!("[upsert_challenge]: failed to bind 'updated_at' with error {}", err));
        }

        Ok(())
    }
}
