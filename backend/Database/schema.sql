-- You can add first name and last name to users if you want..
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255) UNIQUE NOT NULL,
        CHECK (position('@' IN "email") > 1),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE Anything... What you want.

CREATE TABLE roles (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES users(id) ON DELETE CASCADE,
    "role_id" INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE permissions (
--     "id" SERIAL PRIMARY KEY,
--     "name" VARCHAR(255) UNIQUE NOT NULL,
--     "description" VARCHAR(255),
--     "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE role_permissions (
--     "id" SERIAL PRIMARY KEY,
--     "role_id" INTEGER NOT NULL REFERENCES roles(id),
--     "permission_id" INTEGER NOT NULL REFERENCES permissions(id),
--     "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE activity_logs (
--     "id" SERIAL PRIMARY KEY,
--     "user_id" INTEGER NOT NULL REFERENCES users(id),
--     "action" VARCHAR(255) NOT NULL,
--     "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE visitors (
--     "id" SERIAL PRIMARY KEY,
--     "user_id" INTEGER NOT NULL REFERENCES users(id),
--     "ip" VARCHAR(255) NOT NULL,
--     "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE sessions (
--     "id" SERIAL PRIMARY KEY,
--     "user_id" INTEGER NOT NULL REFERENCES users(id),
--     "token" VARCHAR(255) NOT NULL,
--     "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );