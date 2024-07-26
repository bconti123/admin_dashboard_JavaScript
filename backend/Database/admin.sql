\echo "Delete and recreate admin database? (y/n)"
\prompt "Enter your choice: " choice
\if :choice = 'y'
    DROP DATABASE IF EXISTS admin_db;
    CREATE DATABASE admin_db;
    \c admin_db
\endif

\i 'schema.sql'
\i 'seed.sql'

\echo "Delete and recreate admin test database? (y/n)"
\prompt "Enter your choice: " choice
\if :choice = 'y'
    DROP DATABASE IF EXISTS admin_test_db;
    CREATE DATABASE admin_test_db;
    \c admin_test_db
\endif

\i 'schema.sql'