-- Adjust PostgreSQL configuration to enable logical replication

ALTER SYSTEM SET wal_level = logical;

-- Change the password for the 'postgres' user

ALTER USER postgres WITH PASSWORD 'postgres';

-- Create the 'amqp' extension

CREATE EXTENSION IF NOT EXISTS amqp;

-- Alter the table 'amqp.broker' to add a column

ALTER TABLE amqp.broker ADD COLUMN name VARCHAR(32) NOT NULL;

-- Insert values into the 'amqp.broker' table

INSERT INTO
    amqp.broker (
        name,
        host,
        port,
        vhost,
        username,
        password
    )
VALUES (
        'rabbit1',
        'rabbitmq',
        5672,
        '/',
        'guest',
        'guest'
    );

-- Create the function PUBLISH_POST_INSERTION()

CREATE OR REPLACE FUNCTION PUBLISH_POST_INSERTION() 
RETURNS TRIGGER AS $$ 
BEGIN
    PERFORM amqp.publish(
        1,
        'PostgresExchange',
        'postInserted',
        row_to_json(NEW)::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TABLE IF EXISTS "public"."updoot" CASCADE;

DROP TABLE IF EXISTS "public"."user" CASCADE;

DROP TABLE IF EXISTS "public"."post" CASCADE;

CREATE TABLE
    "updoot" (
        "value" integer NOT NULL,
        "userId" integer NOT NULL,
        "postId" integer NOT NULL,
        CONSTRAINT "PK_6476d7e464bcb8571004134515c" PRIMARY KEY ("userId", "postId")
    );

CREATE TABLE
    "user" (
        "id" SERIAL NOT NULL,
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
    );

CREATE TABLE
    "post" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "text" character varying NOT NULL,
        "points" integer NOT NULL DEFAULT 0,
        "creatorId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id")
    );

ALTER TABLE "updoot"
ADD
    CONSTRAINT "FK_9df9e319a273ad45ce509cf2f68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE "updoot"
ADD
    CONSTRAINT "FK_fd6b77bfdf9eae6691170bc9cb5" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "post"
ADD
    CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create the trigger 'POST_INSERTION_AMQP_PUBLISH'
CREATE TRIGGER POST_INSERTION_AMQP_PUBLISH
AFTER INSERT ON POST 
FOR EACH ROW 
EXECUTE FUNCTION PUBLISH_POST_INSERTION();

insert into "user" (username, email, password) values ('dhoni', 'bob@gmail.com', '123456');