--- ENUMS ---
CREATE TYPE status_leito AS ENUM ('OCUPADO', 'LIVRE', 'MANUTENCAO');
CREATE TYPE cargo_usuario AS ENUM ('MEDICO', 'ENFERMAGEM', 'MANUTENCAO');
CREATE TYPE tipo_sensor AS ENUM ('PACIENTE', 'LEITO');
-------------------------------------------------------------------------

--- GERENTE ---
CREATE TABLE IF NOT EXISTS gerente(
    id_gerente SERIAL PRIMARY KEY,
    nome varchar(255) NOT NULL,
    cpf varchar(11) NOT NULL UNIQUE,
    login varchar(255) NOT NULL UNIQUE,
    senha varchar(255) NOT NULL
);

--- CPF CADASTRADO ---
CREATE TABLE IF NOT EXISTS cpf_cadastrado(
    cpf VARCHAR(11) PRIMARY KEY,
    cargo cargo_usuario NOT NULL,
    data_habilitado TIMESTAMP NOT NULL default now(),
    id_gerente INTEGER NOT NULL REFERENCES gerente(id_gerente)
);

--- USUARIO ---
CREATE TABLE IF NOT EXISTS usuario(
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE REFERENCES cpf_cadastrado(cpf),
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

------ PACIENTE -----
CREATE TABLE IF NOT EXISTS paciente(
    id_paciente SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL
);

----- LEITO -----
CREATE TABLE IF NOT EXISTS leito(
    id_leito SERIAL PRIMARY KEY,
    numero_leito INT NOT NULL UNIQUE,
    localizacao VARCHAR(100) NOT NULL,
    status_leito status_leito NOT NULL DEFAULT 'LIVRE',
    id_paciente INT UNIQUE REFERENCES paciente(id_paciente)
);

----- SENSOR -----
CREATE TABLE IF NOT EXISTS sensor(
    id_sensor SERIAL PRIMARY KEY,
    intervalo_leitura INT NOT NULL,
    tipo tipo_sensor NOT NULL
);

----- SENSOR PACIENTE -----
CREATE TABLE IF NOT EXISTS sensor_paciente(
    id_sensor INT PRIMARY KEY REFERENCES sensor(id_sensor),
    id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
    pinos_i2c INT NOT NULL,
    pinos_one_wire INT NOT NULL
);

----- SENSOR AMBIENTE ------
CREATE TABLE IF NOT EXISTS sensor_ambiente(
    id_sensor INT PRIMARY KEY REFERENCES sensor(id_sensor),
    id_leito INT NOT NULL REFERENCES leito(id_leito),
    pinos_sda_scl INT NOT NULL,
    pino_analogico INT NOT NULL
);

----- LEITURA -----
CREATE TABLE IF NOT EXISTS leitura(
    id_leitura SERIAL PRIMARY KEY,
    id_sensor INT NOT NULL REFERENCES sensor(id_sensor),
    data_leitura TIMESTAMP NOT NULL DEFAULT now()
);

----- LEITURA PACIENTE -----
-- Sensores: MAX30102 (spo2/bpm)
CREATE TABLE IF NOT EXISTS leitura_paciente(
    id_leitura INT PRIMARY KEY REFERENCES leitura(id_leitura),
    id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
    temperatura_corporal FLOAT,
    spo2 FLOAT,
    bpm INT
);

----- LEITURA AMBIENTE
-- Sensores: BME280 (temperatura), ENS160 (particulas no ar), KY-037 (ruido)
-- luminosidade
CREATE TABLE IF NOT EXISTS leitura_ambiente(
    id_leitura INT PRIMARY KEY REFERENCES leitura(id_leitura),
    id_leito INT NOT NULL REFERENCES leito(id_leito),
    temperatura_ambiente FLOAT,
    umidade_ambiente FLOAT,
    pressao_ambiente FLOAT,
    indice_tvoc INT,
    indice_eco2 INT,
    nivel_ruido FLOAT,
    nivel_luminosidade FLOAT
);