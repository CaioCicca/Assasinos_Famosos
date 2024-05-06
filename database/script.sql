CREATE DATABASE terror;

CREATE TABLE personagens(
    id SERIAL PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL,
    poder VARCHAR(100) NOT NULL,
    arma VARCHAR(100) NOT NULL,
    forca INT NOT NULL,
    vida INT NOT NULL
);

CREATE TABLE batalhas(
    id SERIAL,
    id_1 INT NOT NULL,
    id_2 INT NOT NULL,
    vencedor INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    poder VARCHAR(100) NOT NULL,
    arma VARCHAR(100) NOT NULL,
    forca INT NOT NULL,
    vida INT NOT NULL,
    FOREIGN KEY(id_1) REFERENCES personagens(id),
    FOREIGN KEY(id_2) REFERENCES personagens(id),
    FOREIGN KEY(vencedor) REFERENCES personagens(id)
);

INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Michael Myers', 'Sede de Sangue', 'Faca', 95, 100);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Freddy Krueger', 'Ataque nos sonhos', 'Garra', 90, 90);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Jason Voorhees', 'Imortalidade', 'Machado', 93, 95);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Leatherface', 'Dilacerar', 'Serra Elétrica', 88, 90);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Pennywise', 'Ilusões', 'Garras', 85, 95);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Chucky', 'Possessão', 'Facão', 200, 100);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Ghostface', 'Stalking', 'Faca e Câmera', 85, 88);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Jigsaw', 'Jogos Mentais', 'Armadilhas', 85, 90);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Samara Morgan', 'Maldição', 'Televisão', 80, 85);
INSERT INTO personagens (nome, poder, arma, forca, vida) VALUES ('Nêmesis', 'Trembolona', 'Tentáculos e Punhos', 85, 88);
