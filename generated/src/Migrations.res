let sql = Postgres.makeSql(~config=Config.db->Obj.magic /* TODO: make this have the correct type */)

module RawEventsTable = {
  let createRawEventsTable: unit => promise<unit> = async () => {
    @warning("-21")
    let _ = await %raw("sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type') THEN
          CREATE TYPE EVENT_TYPE AS ENUM (
          'ERC721Contract_TransferEvent'
          
          );
        END IF;
      END $$;
      `")

    @warning("-21")
    let _ = await %raw("sql`
      CREATE TABLE public.raw_events (
        chain_id INTEGER NOT NULL,
        event_id NUMERIC NOT NULL,
        block_number INTEGER NOT NULL,
        log_index INTEGER NOT NULL,
        transaction_index INTEGER NOT NULL,
        transaction_hash TEXT NOT NULL,
        src_address TEXT NOT NULL,
        block_hash TEXT NOT NULL,
        block_timestamp INTEGER NOT NULL,
        event_type EVENT_TYPE NOT NULL,
        params JSON NOT NULL,
        db_write_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (chain_id, event_id)
      );
      `")
  }

  @@warning("-21")
  let dropRawEventsTable = async () => {
    let _ = await %raw("sql`
      DROP TABLE IF EXISTS public.raw_events;
    `")
    let _ = await %raw("sql`
      DROP TYPE IF EXISTS EVENT_TYPE CASCADE;
    `")
  }
  @@warning("+21")
}

module DynamicContractRegistryTable = {
  let createDynamicContractRegistryTable: unit => promise<unit> = async () => {
    @warning("-21")
    let _ = await %raw("sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_type') THEN
          CREATE TYPE CONTRACT_TYPE AS ENUM (
          'ERC721'
          );
        END IF;
      END $$;
      `")

    @warning("-21")
    let _ = await %raw("sql`
      CREATE TABLE public.dynamic_contract_registry (
        chain_id INTEGER NOT NULL,
        event_id NUMERIC NOT NULL,
        contract_address TEXT NOT NULL,
        contract_type CONTRACT_TYPE NOT NULL,
        PRIMARY KEY (chain_id, contract_address)
      );
      `")
  }

  @@warning("-21")
  let dropDynamicContractRegistryTable = async () => {
    let _ = await %raw("sql`
      DROP TABLE IF EXISTS public.dynamic_contract_registry;
    `")
    let _ = await %raw("sql`
      DROP TYPE IF EXISTS EVENT_TYPE CASCADE;
    `")
  }
  @@warning("+21")
}

module Nftcollection = {
  let createNftcollectionTable: unit => promise<unit> = async () => {
    await %raw(
      "sql`CREATE TABLE \"public\".\"nftcollection\" (\"id\" text NOT NULL,\"contractAddress\" text NOT NULL,\"name\" text,\"symbol\" text,\"maxSupply\" numeric,\"currentSupply\" integer NOT NULL, event_chain_id INTEGER NOT NULL, event_id NUMERIC NOT NULL, db_write_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (\"id\"));`"
    )
  }

  let deleteNftcollectionTable: unit => promise<unit> = async () => {
    // NOTE: we can refine the `IF EXISTS` part because this now prints to the terminal if the table doesn't exist (which isn't nice for the developer).
    await %raw("sql`DROP TABLE IF EXISTS \"public\".\"nftcollection\";`")
  }
}

module User = {
  let createUserTable: unit => promise<unit> = async () => {
    await %raw(
      "sql`CREATE TABLE \"public\".\"user\" (\"id\" text NOT NULL, event_chain_id INTEGER NOT NULL, event_id NUMERIC NOT NULL, db_write_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (\"id\"));`"
    )
  }

  let deleteUserTable: unit => promise<unit> = async () => {
    // NOTE: we can refine the `IF EXISTS` part because this now prints to the terminal if the table doesn't exist (which isn't nice for the developer).
    await %raw("sql`DROP TABLE IF EXISTS \"public\".\"user\";`")
  }
}

module Token = {
  let createTokenTable: unit => promise<unit> = async () => {
    await %raw(
      "sql`CREATE TABLE \"public\".\"token\" (\"id\" text NOT NULL,\"tokenId\" numeric NOT NULL,\"collection\" text NOT NULL,\"owner\" text NOT NULL, event_chain_id INTEGER NOT NULL, event_id NUMERIC NOT NULL, db_write_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE (\"id\"));`"
    )
  }

  let deleteTokenTable: unit => promise<unit> = async () => {
    // NOTE: we can refine the `IF EXISTS` part because this now prints to the terminal if the table doesn't exist (which isn't nice for the developer).
    await %raw("sql`DROP TABLE IF EXISTS \"public\".\"token\";`")
  }
}

let deleteAllTables: unit => promise<unit> = async () => {
  // NOTE: we can refine the `IF EXISTS` part because this now prints to the terminal if the table doesn't exist (which isn't nice for the developer).

  @warning("-21")
  await (
    %raw(
      "sql.unsafe`DROP SCHEMA public CASCADE;CREATE SCHEMA public;GRANT ALL ON SCHEMA public TO postgres;GRANT ALL ON SCHEMA public TO public;`"
    )
  )
}

type t
@module external process: t = "process"

type exitCode = Success | Failure
@send external exit: (t, exitCode) => unit = "exit"

// TODO: all the migration steps should run as a single transaction
let runUpMigrations = async shouldExit => {
  let exitCode = ref(Success)
  await RawEventsTable.createRawEventsTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, `Error creating raw events table`)->Promise.resolve
  })
  await DynamicContractRegistryTable.createDynamicContractRegistryTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, `Error creating dynamic contracts table`)->Promise.resolve
  })
  // TODO: catch and handle query errors
  await Nftcollection.createNftcollectionTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, `Error creating Nftcollection table`)->Promise.resolve
  })
  await User.createUserTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, `Error creating User table`)->Promise.resolve
  })
  await Token.createTokenTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, `Error creating Token table`)->Promise.resolve
  })
  await TrackTables.trackAllTables()->Promise.catch(err => {
    Logging.errorWithExn(err, `Error tracking tables`)->Promise.resolve
  })
  if shouldExit {
    process->exit(exitCode.contents)
  }
  exitCode.contents
}

let runDownMigrations = async shouldExit => {
  let exitCode = ref(Success)
  //
  // await Nftcollection.deleteNftcollectionTable()
  //
  // await User.deleteUserTable()
  //
  // await Token.deleteTokenTable()
  //

  await RawEventsTable.dropRawEventsTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(
      err,
      {
        "msg": "Please ensure the postgres database is running",
        "detail": "Error dropping raw events table",
      },
    )->Promise.resolve
  })
  await DynamicContractRegistryTable.dropDynamicContractRegistryTable()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, "Error dropping dynamic contracts table")->Promise.resolve
  })

  // NOTE: For now delete any remaining tables.
  await deleteAllTables()->Promise.catch(err => {
    exitCode := Failure
    Logging.errorWithExn(err, "Error dropping entity tables")->Promise.resolve
  })
  if shouldExit {
    process->exit(exitCode.contents)
  }
  exitCode.contents
}

let setupDb = async () => {
  // TODO: we should make a hash of the schema file (that gets stored in the DB) and either drop the tables and create new ones or keep this migration.
  //       for now we always run the down migration.
  // if (process.env.MIGRATE === "force" || hash_of_schema_file !== hash_of_current_schema)
  let exitCodeDown = await runDownMigrations(false)
  // else
  //   await clearDb()

  let exitCodeUp = await runUpMigrations(false)

  let exitCode = switch (exitCodeDown, exitCodeUp) {
  | (Success, Success) => Success
  | _ => Failure
  }

  process->exit(exitCode)
}
