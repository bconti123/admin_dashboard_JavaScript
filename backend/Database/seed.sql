INSERT INTO users (username, password, email) 
VALUES
('Root', 'rootpass', 'root@localhost.com'),
('Admin', 'adminpass', 'admin@localhost.com'),
('User', 'userpass', 'user@localhost.com');

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