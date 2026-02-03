CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    password_hash TEXT,
    display_name TEXT,
    avatar_url TEXT DEFAULT 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_token (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (identifier, token)
);
