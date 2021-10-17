use marine_sqlite_connector::{Value, Connection, open, Error};
use crate::register::{ServiceRegistrationPayload};
use chrono::{Utc};

const DB_PATH: &str = "/tmp/identity-link-router.sqlite";

pub struct Manager {
    pub conn: Connection,
}

impl Manager {
    pub fn create() -> Result<Manager, Error> {
        let conn = open(DB_PATH)?;

        Ok(Manager{
            conn
        })
    }

    pub fn initialize_table(&self) -> Result<(), Error> {
        self
            .conn
            .execute("
                    CREATE TABLE IF NOT EXISTS router (
                        service_id TEXT NOT NULL PRIMARY KEY,
                        peer_id TEXT NOT NULL,
                        relay_peer_id TEXT NOT NULL,
                        updated_at DATETIME NOT NULL
                    );
            ")
    }

    pub fn upsert_service(&self, service: &ServiceRegistrationPayload) -> Result<(), Error> {
        let mut stmt = self.conn
            .prepare("
                INSERT INTO router(
                    service_id,
                    peer_id,
                    relay_peer_id,
                    updated_at
                ) VALUES(
                    ?,
                    ?,
                    ?,
                    ?
                )
                ON CONFLICT(service_id)
                DO UPDATE SET
                    peer_id=excluded.peer_id,
                    relay_peer_id=excluded.relay_peer_id,
                    updated_at=excluded.updated_at;
            ")?;


        stmt.bind(1, &Value::String(service.service_id.to_string()))?;
        stmt.bind(2, &Value::String(service.peer_id.to_string()))?;
        stmt.bind(3, &Value::String(service.relay_peer_id.to_string()))?;
        stmt.bind(4, &Value::String(format!("{:?}", Utc::now())))?;
        stmt.cursor().next()?;

        Ok(())
    }

    pub fn get_service(&self, service_id: &String) -> Result<ServiceRegistrationPayload, Error> {
        let mut res = ServiceRegistrationPayload{
            service_id: String::from(""),
            peer_id: String::from(""),
            relay_peer_id: String::from(""),
        };
        let mut stmt = self.conn
            .prepare("
                SELECT * FROM router WHERE service_id=? LIMIT 1; 
            ")?;
        
        stmt.bind(1, &Value::String(service_id.to_string()))?;

        let mut cursor = stmt.cursor();
        let record = cursor.next()?;
        if let Some(row) = record {
            if let Some(service_id) = row[0].as_string() {
                res.service_id = String::from(service_id);
            }
            if let Some(peer_id) = row[1].as_string() {
                res.peer_id = String::from(peer_id);
            }
            if let Some(relay_peer_id) = row[2].as_string() {
                res.relay_peer_id = String::from(relay_peer_id);
            }
        }

        Ok(res)
    }
}
