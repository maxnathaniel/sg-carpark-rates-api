
CREATE SCHEMA Carpark;

CREATE TABLE IF NOT EXISTS Carpark.carpark_rates
(
    id SERIAL,
    name character varying(255),
    region character varying(50),
    weekday_before_5 text,
    weekday_after_5 text,
    saturday text,
    sunday_ph text,
    CONSTRAINT carpark_rates_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Carpark.api_keys
(
    hash text,
    email_address character varying(255),
    created_at timestamptz,
    modified_at timestamptz,
    is_blacklisted boolean,
    expiry timestamptz,
    CONSTRAINT hash_pkey PRIMARY KEY (hash)
);
