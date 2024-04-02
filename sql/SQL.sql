CREATE DATABASE GameHub;

CREATE SCHEMA data;

CREATE USER GAMEHUB_ADMIN with password 'password';

GRANT ALL privileges on SCHEMA data to gamehub_admin;

CREATE TABLE "user" (
    ID serial primary key,
    Name text not null,
    Description text,
    Password text not null,
    Email text not null unique,
    Role text not null,
    WalletUSD money default(0)
);

CREATE TABLE Company (
    ID serial primary key,
    Name text not null,
    Description text,
    State int default(0)
);

CREATE TABLE Game (
    ID serial primary key,
    Company int references Company(ID) not null,
    Name text not null,
    Description text,
    Tags text,
    State int default(0),
    PriceUSD money not null
);

CREATE TABLE CompanyMember (
    ID SERIAL primary key,
    "User" int references "user"(ID) not null,
    Company int references Company(ID) not null,
    Role text not null
);

create table Sale (
    ID serial primary key,
    Game int references Game(ID) not null,
    Percent float4 default(0),
    Cause text,
    UntilTo timestamp not null
);

create table PaymentMethod (
    ID serial primary key,
    "User" int references "user"(ID),
    Company int references Company(ID),
    Currency text not null,
    Type int default(0),
    SpecialInformation json
);

create table Transaction (
    ID serial primary key,
    UserPaymentMethod int references PaymentMethod(ID) not null,
    CompanyPaymentMethod int references PaymentMethod(ID) not null,
    Game int references Game(ID) not null,
    Note text
);

create table Review (
    ID serial primary key,
    Game int references Game(ID) not null,
    "User" int references "user"(ID) not null,
    Text text not null,
    Mark int not null
);

drop table Transaction;
drop table Sale;
drop table Review;
drop table CompanyMember;
drop table Game;
drop table PaymentMethod;
drop table Company;
drop table "user";

--SHA2-256 salt = GAMEHUB
INSERT INTO "user" (Name, Description, Password, Email, Role) values ('ADMIN', 'ADMIN DESC',
                                                                      '6a5590546b7bd526c98537c5aea7ee8feb0b6ed00ba11717af4e1bf650412818',
                                                                      'admin@mail.com', 'ADMIN');

INSERT INTO "user" (Name, Description, Password, Email, Role) values ('USER', 'USER DESC',
                                                                      '6a5590546b7bd526c98537c5aea7ee8feb0b6ed00ba11717af4e1bf650412818',
                                                                      'user@mail.com', 'USER');

INSERT INTO "user" (Name, Description, Password, Email, Role) values ('DEVELOPER', 'DEVELOPER DESC',
                                                                      '6a5590546b7bd526c98537c5aea7ee8feb0b6ed00ba11717af4e1bf650412818',
                                                                      'developer@mail.com', 'DEVELOPER');

INSERT INTO Company (Name, Description, state) values ('StarSverSquad', '3S', 1);

SELECT * from Company;
SELECT * from "user"; -- admin@mail.com
SELECT * from Game;

DELETE FROM "user" where id = 4 or id = 5;

INSERT INTO Game (Company, Name, Description, Tags, State, PriceUSD) VALUES (1, 'Thomos the train', 'Remake', 'JRPG:Undertale:RPG', 1, 1.99);