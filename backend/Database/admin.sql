
DROP DATABASE IF EXISTS admin_db;
CREATE DATABASE admin_db;
\connect admin_db
\i schema.sql
\i seed.sql

DROP DATABASE IF EXISTS admin_test_db;
CREATE DATABASE admin_test_db;
\connect admin_test_db

\i schema.sql