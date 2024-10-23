INSERT INTO users (username, password, first_name, last_name, email) 
VALUES
('Root', 'rootpass', 'root', 'user', 'root@localhost.com'),
('Admin', 'adminpass', 'admin', 'user', 'admin@localhost.com'),
('User', 'userpass', 'user', 'user', 'user@localhost.com');

INSERT INTO roles (name, description) 
VALUES
('root', 'root role'),
('admin', 'admin role'),
('user', 'user role');

INSERT INTO user_roles (user_id, role_id) 
VALUES
(1, 1),
(2, 2),
(3, 3);