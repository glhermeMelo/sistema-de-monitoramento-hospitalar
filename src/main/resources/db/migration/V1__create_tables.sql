--- ENUMS ---
CREATE TYPE status_leito AS ENUM ('OCUPADO', 'LIVRE', 'MANUTENCAO');
CREATE TYPE cargo_usuario AS ENUM ('MEDICO', 'ENFERMAGEM', 'MANUTENCAO');
CREATE TYPE tipo_sensor AS ENUM ('PACIENTE', 'LEITO')
-------------------------------------------------------------------------
--- GERENTE ---
CREATE TABLE IF NO EXISTS gerente(
    id_gerente SERIAL PRIMARY KEY,
    nome varchar(255) NOT NULL,
    cpf varchar(11) NOT NULL UNIQUE,
    login varchar(255) NOT NULL UNIQUE,
    senha varchar(255) NOT NULL
);

--- CPF CADASTRADO ---
CREATE TABLE IF NO EXISTS cpf_cadastrado(
    cpf VARCHAR(11) PRIMARY KEY,
    cargo cargo_usuario NOT NULL,
    data_habilitado TIMESTAMP NOT NULL,
    id_gerente INTEGER NOT NULL REFERENCES gerente(id_gerente)
);

--- USUARIO ---
CREATE TABLE IF NO EXISTS usuario(
    id_usuario INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE REFERENCES cpf_cadastrado(cpf),
    login VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo cargo_usuario NOT NULL,
);

--- MEDICO ---
CREATE TABLE IF NO EXISTS medico(
    id_medico INT PRIMARY KEY REFERENCES usuario(id_usuario)
);

--- MANUTENCAO ---
CREATE TABLE IF NO EXISTS manutencao(
    id_manutencao INT PRIMARY KEY REFERENCES usuario(id_usuario)
)
--- ENFERMAGEM ---
CREATE TABLE IF NO EXISTS enfermagem(
    id_enfermagem INT PRIMARY KEY REFERENCES usuario(id_usuario)
);

------ PACIENTE -----
CREATE TABLE IF NO EXISTS paciente(
    id_paciente INT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
);

----- LEITO -----
CREATE TABLE IF NO EXISTS leito(
    id_leito INT PRIMARY KEY,
    numero_leito INT NOT NULL UNIQUE,
    localizacao VARCHAR(100) NOT NULL,
    status_leito status_leito NOT NULL DEFAULT 'LIVRE',
    id_paciente INT UNIQUE NOT NULL REFERENCES paciente(id_paciente)
)
----- SENSOR -----
CREATE TABLE IF NO EXISTS sensor(
    id_sensor VARCHAR(30) PRIMARY KEY,
    intervalo_leitura INT NOT NULL,
    tipo tipo_sensor NOT NULL
);

----- SENSOR PACIENTE -----
CREATE TABLE IF NO EXISTS sensor_paciente(
    id_sensor VARCHAR(30) PRIMARY KEY REFERENCES sensor(id_sensor),
    id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
    pinos_i2c INT NOT NULL,
    pinos_one_wire INT NOT NULL
);

----- SENSOR AMBIENTE ------
CREATE TABLE IF NO EXISTS sensor_ambiente(
    id_sensor VARCHAR(30) PRIMARY KEY REFERENCES sensor(id_sensor),
    id_leito INT NOT NULL REFERENCES leito(id_leito),
    pinos_sda_scl_ INT NOT NULL,
    pino_analogico INT NOT NULL
);

----- LEITURA PACIENTE -----
-- Sensores: MAX30102 (spo2/bpm)
CREATE TABLE IF NO EXISTS leitura_paciente(
    id_leitura INT PRIMARY KEY,
    id_sensor VARCHAR(30) NOT NULL REFERENCES sensor_paciente(id_sensor),
    id_paciente INT NOT NULL REFERENCES paciente(id_paciente),
    data_leitura TIMESTAMP NOT NULL,
    temperatura_corporal FLOAT,
    spo2 FLOAT,
    bpm INT
);

----- LEITURA AMBIENTE
-- Sensores: BME280 (temperatura), ENS160 (particulas no ar), KY-037 (ruido)
-- luminosidade
CREATE TABLE IF NO EXISTS leitura_ambiente(
    id_leitura INT PRIMARY KEY,
    id_sensor VARCHAR(30) NOT NULL REFERENCES sensor_ambiente(id_sensor),
    id_leito INT NOT NULL REFERENCES leito(id_leito),
    data_leitura TIMESTAMP NOT NULL,
    temperatura_ambiente FLOAT,
    umidade_ambiente FLOAT,
    pressao_ambiente FLOAT,
    indice_tvoc INT,
    idice_eco2 INT,
    nivel_ruido FLOAT,
    nivel_luminosidade FLOAT
);