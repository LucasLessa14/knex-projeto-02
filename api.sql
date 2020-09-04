CREATE TABLE users(
  id serial NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  role int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE passwordtokens(
  id serial NOT NULL,
  token text NOT NULL,
  user_id int NOT NULL,
  used int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);