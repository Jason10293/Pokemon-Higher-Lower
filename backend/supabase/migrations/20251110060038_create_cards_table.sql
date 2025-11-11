create table if NOT EXISTS cards (
    id serial primary key,
    title varchar(255) not null,
    created_at timestamp with time zone default current_timestamp,
    updated_at timestamp with time zone default current_timestamp,
    image_url varchar(512)
);