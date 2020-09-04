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

CREATE TABLE compartment(
  id serial NOT NULL,
  name text NOT NULL,
  description text,
  amount int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE category(
  id serial NOT NULL,
  name text NOT NULL,
  description text,
  amount int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE component(
  id serial NOT NULL,
  name text NOT NULL,
  amount int NOT NULL,
  category_id int,
	compartment_id int,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES category (id),
  FOREIGN KEY (compartment_id) REFERENCES compartment (id)
);

CREATE TABLE operation(
  id serial NOT NULL,
  user_id int NOT NULL,
  type int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE operation_component(
  id serial NOT NULL,
  operation_id int NOT NULL,
  component_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (operation_id) REFERENCES operation (id),
  FOREIGN KEY (component_id) REFERENCES component (id)
);