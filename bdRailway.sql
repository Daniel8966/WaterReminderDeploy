
DROP TABLE IF EXISTS `usuario`;

CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `Usuario` varchar(45) DEFAULT NULL,
  `Password` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `Sesion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idUsuario`)
) 

DROP TABLE IF EXISTS `privilegio`;

CREATE TABLE `privilegio` (
  `idPrivilegio` int NOT NULL AUTO_INCREMENT,
  `privilegio` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPrivilegio`)
)

DROP TABLE IF EXISTS `sexo`;

CREATE TABLE `sexo` (
  `idsexo` int NOT NULL AUTO_INCREMENT,
  `sexo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idsexo`)
)


DROP TABLE IF EXISTS `persona`;

CREATE TABLE `persona` (
  `idPersona` int NOT NULL AUTO_INCREMENT,
  `peso` int DEFAULT NULL,
  `altura` varchar(10) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `meta_agua` varchar(45) DEFAULT NULL,
  `hora_desp` varchar(45) DEFAULT NULL,
  `hora_dormir` varchar(45) DEFAULT NULL,
  `tasa` int DEFAULT NULL,
  `Actividad_fisica` int DEFAULT NULL,
  `Sexo_idsexo` int NOT NULL,
  `Privilegio_idPrivilegio` int NOT NULL,
  `Usuario_idUsuario` int NOT NULL,
  PRIMARY KEY (`idPersona`,`Sexo_idsexo`,`Privilegio_idPrivilegio`,`Usuario_idUsuario`),
  KEY `fk_Persona_Sexo1_idx` (`Sexo_idsexo`),
  KEY `fk_Persona_Privilegio1_idx` (`Privilegio_idPrivilegio`),
  KEY `fk_persona_Usuario1_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_Persona_Privilegio1` FOREIGN KEY (`Privilegio_idPrivilegio`) REFERENCES `privilegio` (`idPrivilegio`),
  CONSTRAINT `fk_Persona_Sexo1` FOREIGN KEY (`Sexo_idsexo`) REFERENCES `sexo` (`idsexo`),
  CONSTRAINT `fk_persona_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) 


DROP TABLE IF EXISTS `alarmas`;

CREATE TABLE `alarmas` (
  `idAlarmas` int NOT NULL AUTO_INCREMENT,
  `hora` varchar(10) DEFAULT NULL,
  `minutos` varchar(10) DEFAULT NULL,
  `Persona_idPersona` int NOT NULL,
  PRIMARY KEY (`idAlarmas`,`Persona_idPersona`),
  KEY `fk_Alarmas_Persona1_idx` (`Persona_idPersona`),
  CONSTRAINT `fk_Alarmas_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) 


DROP TABLE IF EXISTS `cgrupos`;

CREATE TABLE `cgrupos` (
  `idCGrupos` int NOT NULL AUTO_INCREMENT,
  `Nombre_Grupo` varchar(45) DEFAULT NULL,
  `estadoGrupo` int DEFAULT NULL,
  `adminID` int NOT NULL,
  PRIMARY KEY (`idCGrupos`,`adminID`),
  KEY `fk_CGrupos_persona_idx` (`adminID`),
  CONSTRAINT `fk_CGrupos_persona` FOREIGN KEY (`adminID`) REFERENCES `persona` (`idPersona`)
)


DROP TABLE IF EXISTS `persona_has_cgrupos`;

CREATE TABLE `persona_has_cgrupos` (
  `Persona_Grupoid` int NOT NULL AUTO_INCREMENT,
  `persona_idPersona` int NOT NULL,
  `CGrupos_idCGrupos` int NOT NULL,
  PRIMARY KEY (`Persona_Grupoid`,`persona_idPersona`,`CGrupos_idCGrupos`),
  KEY `fk_persona_has_CGrupos_CGrupos1_idx` (`CGrupos_idCGrupos`),
  KEY `fk_persona_has_CGrupos_persona1_idx` (`persona_idPersona`),
  CONSTRAINT `fk_persona_has_CGrupos_CGrupos1` FOREIGN KEY (`CGrupos_idCGrupos`) REFERENCES `cgrupos` (`idCGrupos`),
  CONSTRAINT `fk_persona_has_CGrupos_persona1` FOREIGN KEY (`persona_idPersona`) REFERENCES `persona` (`idPersona`)
) 



DROP TABLE IF EXISTS `ctipo_bebida`;

CREATE TABLE `ctipo_bebida` (
  `idCTipo_bebida` int NOT NULL,
  `tipo_bebida` varchar(45) DEFAULT NULL,
  `nombre_bebida` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCTipo_bebida`)
) 

DROP TABLE IF EXISTS `datos_bebida`;

CREATE TABLE `datos_bebida` (
  `idRegistro_bebida` int NOT NULL,
  `agua_bebida` int DEFAULT NULL,
  `cal_bebida` int DEFAULT NULL,
  `azucar_bebida` int DEFAULT NULL,
  `ml` int DEFAULT NULL,
  `CTipo_bebida_idCTipo_bebida` int NOT NULL,
  PRIMARY KEY (`idRegistro_bebida`,`CTipo_bebida_idCTipo_bebida`),
  KEY `fk_Registro_bebida_CTipo_bebida1_idx` (`CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_Registro_bebida_CTipo_bebida1` FOREIGN KEY (`CTipo_bebida_idCTipo_bebida`) REFERENCES `ctipo_bebida` (`idCTipo_bebida`)
) 



DROP TABLE IF EXISTS `consumo_agua`;

CREATE TABLE `consumo_agua` (
  `idConsumo_Agua` int NOT NULL AUTO_INCREMENT,
  `Consumo_Total` int DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Persona_idPersona` int NOT NULL,
  `datos_bebida_idRegistro_bebida` int NOT NULL,
  `datos_bebida_CTipo_bebida_idCTipo_bebida` int NOT NULL,
  PRIMARY KEY (`idConsumo_Agua`,`Persona_idPersona`,`datos_bebida_idRegistro_bebida`,`datos_bebida_CTipo_bebida_idCTipo_bebida`),
  KEY `fk_Consumo_Agua_Persona1_idx` (`Persona_idPersona`),
  KEY `fk_consumo_agua_datos_bebida1_idx` (`datos_bebida_idRegistro_bebida`,`datos_bebida_CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_consumo_agua_datos_bebida1` FOREIGN KEY (`datos_bebida_idRegistro_bebida`, `datos_bebida_CTipo_bebida_idCTipo_bebida`) REFERENCES `datos_bebida` (`idRegistro_bebida`, `CTipo_bebida_idCTipo_bebida`),
  CONSTRAINT `fk_Consumo_Agua_Persona1` FOREIGN KEY (`Persona_idPersona`) REFERENCES `persona` (`idPersona`)
) 


