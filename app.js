
import {
    PORT
} from './config.js'
//import de todo
import express from 'express';

import bodyParser from 'body-parser';
import path from 'path';


//Resolver dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


//Delcara la app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//dotenv ?
import dotenv from 'dotenv';
dotenv.config({ path: './env/.env' })
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public')); //RUTA DE CARPETA DE RECURSOS EXTERNOS


//------ESTABLECIENDO EL MOTOR DE PLANTILLAS EJS------
app.set('view engine', 'ejs');

//------INVOCANDO BCRYPTJS------

import bycryptjs from 'bcryptjs';
//const bcryptjs = require('bcryptjs');

//------VARS DE SESION

import session from 'express-session';
//const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//------INVOCAMOS A LA CONEXION DE LA BD------
import mysql from 'mysql2';
//const mysql=require('mysql2');

import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,

} from './config.js'
import { cp } from 'fs';


const connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.log('El error de conexion es: ' + error);
        return;
    }
    console.log('CONECTADO A LA BD WIIII')
});

//const connection = require('./database/db');



//------RUTAS DE LAS PAGINAS------
//RUTA RAIZ
app.get('/prueba', (req, res) => {

    res.render('prueba')

})
app.get('/prueba2', (req, res) => {

    res.send('prueba2')

})


app.get('/', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-HOME')
        res.render('index', {
            login: true,
            name: req.session.Usuario

        })
    } else {
        console.log('NO hay sesion activa')
        res.render('index', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//REGISTRO DE USUARIO--
app.get('/registrarse', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        res.render('home', {
            login: true,
            name: req.session.Usuario

        })
    } else {
        console.log('NO hay sesion activa-Registro')
        res.render('registrar', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//INICIO DE SESION--
app.get('/login', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        res.render('home', {
            login: true,
            name: req.session.Usuario

        })
    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//HOME--CONFIRMAR CONSUMO DE AGUA Y TABLA DE CONSUMO
app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        //BACK CONSUMO DE AGUA IDEAL
        connection.query(' SELECT peso,altura,edad,Actividad_fisica FROM persona WHERE idPersona="' + req.session.idPersona + '"', (error, results) => {
            if (error) throw error;
            req.session.peso = results[0].peso
            req.session.altura = results[0].altura
            req.session.Actividad_fisica = results[0].Actividad_fisica
        })

        const consumoIdeal2 = parseFloat(req.session.peso) + parseFloat(req.session.altura) + parseFloat(req.session.Actividad_fisica)
        const consumoIdeal = 66 + (13.7 * parseFloat(req.session.peso)) + (5 * parseFloat(req.session.altura)) - (6.5 * 20)
        console.log(`Debes tomar ${consumoIdeal}`)


        //BACK DE CONSUMO DE AGUA TOTAL
        connection.query('SELECT SUM(Consumo_Total) FROM consumo_agua WHERE Persona_idPersona ="' + req.session.idPersona + '"', (error, results) => {
            if (error) throw error;
            req.session.consumoTotal = results[0].Consumo_Total
        })


        console.log('Sesion creada y existente-HOME')
        connection.query('SELECT * FROM consumo_agua WHERE Persona_idPersona="' + req.session.idPersona + '"', (error, results) => {
            if (error) throw error;
            res.render('home', { consumoUser: results, nombre: req.session.nombre, tuAgua: consumoIdeal, totalAgua: req.session.consumoTotal })
        })
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//REGISTROS DE CONSUMO DE AGUA
app.get('/regAgua', (req, res) => {
    if (req.session.loggedin) {

        console.log('Sesion creada y existente-graficaAgua')
        const fechaHora = new Date();
        const anio = fechaHora.getFullYear()
        const mes = (parseInt(fechaHora.getMonth()) + 1)
        const idPersona = req.session.idPersona;
        console.log('id Persona: ' + idPersona)


        let sum0, sum1, sum2, sum3, sum4, sum5, sum6, sum7 = 0;


        var dia = (parseInt(fechaHora.getDate()) - 0);
        console.log(`fecha 1 : ${anio}-${mes}-${dia}`);
        var query0 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia}') and Persona_idPersona = ${idPersona}`

        connection.query(query0, (error, results0) => {
            if (error) throw error;
            console.log('---------------caso: ' + 0 + "-------------")
            console.log(`fecha: ${anio}-${mes}-${dia}`)
            console.log('suma caso ' + 0 + "" + results0[0].Consumo_Total)
            sum0 = results0[0].Consumo_Total;
            console.log(query0)


            var dia1 = (parseInt(fechaHora.getDate()) - 1);
            console.log(`fecha 2 : ${anio}-${mes}-${dia1}`)
            var query1 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia1}') and Persona_idPersona = ${idPersona}`
            connection.query(query1, (error, results1) => {
                if (error) throw error;
                console.log('---------------caso: ' + 1 + "-------------")
                console.log(`fecha: ${anio}-${mes}-${dia1}`)
                console.log('suma caso ' + 1 + " " + results1[0].Consumo_Total)
                sum1 = results1[0].Consumo_Total;

                var dia2 = (parseInt(fechaHora.getDate()) - 2)
                console.log(`fecha 2 : ${anio}-${mes}-${dia2}`)
                var query2 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia2}') and Persona_idPersona = ${idPersona}`
                connection.query(query2, (error, results2) => {
                    if (error) throw error;
                    console.log('---------------caso: ' + 2 + "-------------")
                    console.log(`fecha: ${anio}-${mes}-${dia2}`)
                    console.log('suma caso ' + 2 + "" + results2[0].Consumo_Total)
                    sum2 = results2[0].Consumo_Total;

                    var dia3 = (parseInt(fechaHora.getDate()) - 3)
                    var query3 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia3}') and Persona_idPersona = ${idPersona}`
                    connection.query(query3, (error, results3) => {
                        if (error) throw error;
                        console.log('---------------caso: ' + 3 + "-------------")
                        console.log(`fecha: ${anio}-${mes}-${dia3}`)
                        console.log('suma caso ' + 3 + "" + results3[0].Consumo_Total)
                        sum3 = results3[0].Consumo_Total;

                        var dia4 = (parseInt(fechaHora.getDate()) - 4)
                        var query4 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia4}') and Persona_idPersona = ${idPersona}`
                        connection.query(query4, (error, results4) => {
                            if (error) throw error;
                            console.log('---------------caso: ' + 4 + "-------------")
                            console.log(`fecha: ${anio}-${mes}-${dia4}`)
                            console.log('suma caso ' + 4 + "" + results4[0].Consumo_Total)
                          
                            sum4 = results4[0].Consumo_Total;

                            var dia5 = (parseInt(fechaHora.getDate()) - 5)
                            var query5 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia5}') and Persona_idPersona = ${idPersona}`
                            connection.query(query5, (error, results5) => {
                                if (error) throw error;

                                console.log('---------------caso: ' + 5 + "-------------")
                                console.log(`fecha: ${anio}-${mes}-${dia5}`)
                                console.log('suma caso ' + 5 + "" + results5[0].Consumo_Total)
                                sum5 = results5[0].Consumo_Total;


                                var dia6 = (parseInt(fechaHora.getDate()) - 6)
                                var query6 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia6}') and Persona_idPersona = ${idPersona}`
                                connection.query(query6, (error, results6) => {
                                    if (error) throw error;

                                    console.log('---------------caso: ' + 6 + "-------------")
                                    console.log(`fecha: ${anio}-${mes}-${dia6}`)
                                    console.log('suma caso ' + 6 + "" + results6[0].Consumo_Total)
                                    sum6 = results6[0].Consumo_Total;


                                    var dia7 = (parseInt(fechaHora.getDate()) - 7)
                                    var query7 = `select SUM(Consumo_Total) as Consumo_Total from consumo_agua where Fecha =   ('${anio}-${mes}-${dia7}') and Persona_idPersona = ${idPersona}`
                                    connection.query(query7, (error, results7) => {
                                        if (error) throw error;
                                        console.log('---------------caso: ' + 7 + "-------------")
                                        console.log(`fecha: ${anio}-${mes}-${dia}`)
                                        console.log('suma caso ' + 7 + "" + results7[0].Consumo_Total)
                                        sum7 = results7[0].Consumo_Total;
                                        console.log('suma 0: ' + sum0 +
                                            ' suma 1: ' + sum1 +
                                            ' suma 2: ' + sum2 +
                                            ' suma 3: ' + sum3 +
                                            ' suma 4: ' + sum4 +
                                            ' suma 5: ' + sum5 +
                                            ' suma 6: ' + sum6 +
                                            ' suma 7: ' + sum7 + '')
                                        res.render('registros', { sum0, sum1, sum2, sum3, sum4, sum5, sum6, sum7 });

                                    })

                                })
                            })

                        })
                    })

                })
            })

        })
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }

})
app.get('/regAgua2', (req, res) => {
    if (req.session.loggedin) {

        console.log('Sesion creada y existente-graficaAgua mes')
        const fechaHora = new Date();
        const anio = fechaHora.getFullYear()
        var mes = (parseInt(fechaHora.getMonth()) + 1)
        const dia = (parseInt(fechaHora.getDate()))
        const idPersona = req.session.idPersona;

        var fecha = `('${anio}-${mes}-${dia}')`;
        let sum0, sum1, sum2 = 0;


        connection.query(`SELECT SUM(Consumo_Total) as sumita FROM consumo_agua WHERE MONTH(Fecha) = ('${anio}-${mes}-${dia}') and Persona_idPersona = ${idPersona}`, (error, results) => {
            if (error) throw error;
            console.log('---------------caso: ' + 0 + "-------------")
            console.log(`fecha: ${anio}-${mes}-${dia}`)
            console.log('suma mes ' + 1 + "" + results[0].sumita)
            sum0 = results[0].Consumo_Total;


        })

    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }

})

//OTRAS BEBIDAS--REFRESCOS
app.get('/Bebidas', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-otrasBebidas')
        res.render('otrasbebidas')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//OTRAS BEBIDAS--ALCOHOLES
app.get('/Bebidas2', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-otrasBebidas')
        res.render('alcoholes')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//OTRAS BEBIDAS--JUGOS
app.get('/Bebidas3', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-otrasBebidas')
        res.render('jugos')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//OTRAS BEBIDAS--ENERGETICAS
app.get('/Bebidas4', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-otrasBebidas')
        res.render('bebidasener')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//CONFIGURACIONES DEL USUARIO--
app.get('/configuracion', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-Configuracion')
        res.render('configuraciones')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//CAMBIAR PESO Y ALTURA--
app.get('/pesoaltura', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-PesoAlt')
        res.render('pesoaltura')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})
//CAMBIAR CONTRASENAS--
app.get('/changeContra', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion creada y existente-Contrasena')
        res.render('cambiarcontrasena')
    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }
})



//------BACK DE FUNCIONES DE REGISTRO E INICIO DE SESION------


//BACK DE REGISTRO DE USUARIO
//BACK DE REGISTRO
app.post('/registrarse', async (req, res) => {
    const nombre = req.body.name;
    const user = req.body.correo;
    const password = req.body.pass;
    const peso = req.body.peso;
    const altura = req.body.altura;
    const edad = req.body.edad;
    const meta_agua = '2300';
    const hora_desp = req.body.despertar;
    const hora_dormir = req.body.dormir;
    const taza = 0;
    const Actividad_fisica = req.body.actFisica;
    const sexo = req.body.sexo;
    const privilegio = 1;

    connection.query('INSERT INTO usuario SET ?', { Usuario: nombre, Password: password, email: user, Sesion: 0 }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Usuario Registrado con exito')


            connection.query('select idUsuario from usuario where email = ? and Password = ? ', [user, password], async (error, results) => {
                if (error) return console.log("Error", error)

                var idUsuario = 0;
                idUsuario = results[0].idUsuario;
                console.log('el id recuperado' + results[0].idUsuario)

                connection.query('INSERT INTO persona SET ?', { peso: peso, altura: altura, edad: edad, meta_agua: meta_agua, hora_desp: hora_desp, hora_dormir: hora_dormir, tasa: taza, Actividad_fisica: parseInt(Actividad_fisica), Sexo_idsexo: parseInt(sexo), Privilegio_idPrivilegio: parseInt(privilegio), Usuario_idUsuario: idUsuario }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Persona Registrada con exito')
                        res.redirect('/login')
                    }
                })


            })

        }

    })




})
//BACK DE LOGIN
app.post('/auth', async (req, res) => {
    const Usuario = req.body.usuario;
    const Password = req.body.pass;

    if (Usuario && Password) {
        connection.query('SELECT idPersona, idUsuario FROM persona INNER JOIN usuario ON persona.Usuario_idUsuario=usuario.idUsuario WHERE email="' + Usuario + '"', (error, respuesta, field) => {
            console.log(`EL id de quien ingreso es: ${respuesta[0].idPersona}`)
            req.session.idPersona = respuesta[0].idPersona; //Guardando Id de persona en la sesion
        })

        connection.query('SELECT idUsuario FROM usuario WHERE email="' + Usuario + '"', (error, respuesta, field) => {
            console.log(`EL idUsuario es : ${respuesta[0].idUsuario}`)
            req.session.idUsuario = respuesta[0].idUsuario; //Guardando Id del usuario en la sesion
        })


        connection.query('SELECT email FROM usuario WHERE email="' + Usuario + '"', (error, respuesta, field) => {
            if (respuesta[0].email === Usuario) {
                console.log('Usuario existente')
            } else {
                res.redirect('/login')
                console.log('Usuario inexistente')
            }
        })

        connection.query('SELECT usuario FROM usuario WHERE email="' + Usuario + '"', (error, respuesta, field) => {
            req.session.nombre = respuesta[0].usuario;
        })

        connection.query('SELECT Password FROM usuario WHERE email="' + Usuario + '"', (error, respuesta, field) => {

            if (respuesta[0].Password === Password) {
                console.log('Ingreso exitoso al sistema')
                req.session.loggedin = true; //Creando la sesion
                req.session.usuario = Usuario; //Guardando nombre de usuario en la sesion
                res.redirect('/home')
            } else {
                res.redirect('/login')
                console.log('Contrasena incorrecta')
            }
        })
    } else {
        res.redirect('/login')
    }
})


//CERRAR SESION
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        console.log('Sesion cerrada')
        res.redirect('/')
    })
})

//------BACK DE FUNCIONES DEL SISTEMA------

//AGREGAR CONSUMO DE AGUA
app.post('/addWater', (req, res) => {
    const cantidad = req.body.taza;
    const fechaHora = new Date();
    const anio = fechaHora.getFullYear()
    const mes = (parseInt(fechaHora.getMonth()) + 1 )
    const dia = (parseInt(fechaHora.getDate()) ) ;

    console.log("anio: " + anio + " mes: " + mes + " dia: " + dia)
    connection.query(`INSERT INTO consumo_agua (Consumo_Total,Fecha,Persona_idPersona,datos_bebida_idRegistro_bebida,datos_bebida_CTipo_bebida_idCTipo_bebida) VALUES (${parseInt(cantidad)},'${anio}-${mes}-${dia}',${req.session.idPersona},1,1)`, (err, respuesta, fields) => {
        if (err) return console.log("Error", err)

    })
    return res.redirect('/home');

})


//ELIMINAR CONSUMO DE AGUA
app.get('/delWater/:id', (req, res) => {
    const idRegistro = req.params.id

    connection.query('DELETE FROM consumo_agua WHERE idConsumo_Agua="' + idRegistro + '"', (err, respuesta, fields) => {
        if (err) return console.log("Error", err)
        return res.redirect('/home');
    })

})

//CAMBIAR CONTRASENA
app.post('/changeContra', (req, res) => {
    const contra = req.body.pass2
    const contra2 = req.body.pass1
    if (contra === contra2) {
        connection.query(`UPDATE usuario SET Password=${contra} WHERE idUsuario=${req.session.idPersona}`, (err, respuesta, fields) => {
            if (err) return console.log("Error", err)
            return res.redirect('/home');

        })
    } else {
        res.redirect('/configuracion');
    }



})

//CAMBIAR PESO
app.post('/changePeso', (req, res) => {
    const peso = req.body.peso
    connection.query(`UPDATE persona SET peso=${peso} WHERE Usuario_idUsuario=${req.session.idPersona}`, (err, respuesta, fields) => {
        if (err) return console.log("Error", err)
        return res.redirect('/configuracion');

    })

})

//CAMBIAR ALTURA
app.post('/changeAltura', (req, res) => {
    const altura = req.body.altura
    connection.query(`UPDATE persona SET altura=${altura} WHERE Usuario_idUsuario=${req.session.idPersona}`, (err, respuesta, fields) => {
        if (err) return console.log("Error", err)
        return res.redirect('/configuracion');

    })

})

//----------BACK DE FUNCIONES DE GRUPO-------------

//Apartadfo de grupos
app.get('/grupo', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente - grupos')
        var idPersona = req.session.idPersona;
        var query = String("select persona_has_cgrupos.CGrupos_idCGrupos as 'codigo1', CGrupos.idcGrupos as 'codigo2', persona_has_cgrupos.persona_idPersona as 'idPersona' , CGrupos.Nombre_Grupo as 'nombreGrupo' from persona_has_cgrupos Inner join CGrupos	on persona_has_cgrupos.CGrupos_idCGrupos = CGrupos.idCGrupos where persona_has_cgrupos.persona_idPersona = ?; ")
        connection.query(query, [idPersona], (error, respuesta) => {
            if (error) {
                console.log("errror al seleccionar" + error);
                throw error;
            } else {
                //console.log(respuesta[0].Persona_Grupoid);
                res.render('grupos', { respuesta: respuesta })
            }
        })

    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }


})

//Participantes del grupo

app.post('/grupos', (req, res) => {
    if (req.session.loggedin) {
        console.log('Sesion existente')
        var idGrupo = req.body.codigo;
        var query = String("select " +
            "idUsuario as 'idUsuario', " +
            "idPersona as 'idPersona', " +
            "adminID as 'admin', " +
            "Usuario as 'nombre', " +
            "email as 'email', " +
            "meta_agua as 'meta_agua', " +
            "CGrupos_idCGrupos as 'idGrupo', " +
            "Nombre_Grupo as 'Nombre_Grupo' " +

            "from usuario u " +
            "inner join persona p " +
            "on u.idUsuario = p.Usuario_idUsuario " +
            "inner join persona_has_cgrupos pg " +
            "on p.idPersona = pg.persona_idPersona " +
            "inner join CGrupos g " +
            "on pg.CGrupos_idCGrupos = g.idCGrupos where g.idCGrupos = ? ;")
        try {
            connection.query(query, [idGrupo], (error, respuesta) => {
                if (error) {
                    console.log("errror al seleccionar" + error);
                    throw error;
                } else {
                    //comprobar si el usuario es admin o usuario

                    //Obtener datos de la query
                    var admin = respuesta[0].admin;
                    var codigo = respuesta[0].idGrupo;
                    var nombreGrupo = respuesta[0].Nombre_Grupo;


                    if (req.session.idPersona == admin) {
                        console.log('el usuario es admin');
                        var admon = 1;
                        res.render('grupos1', { respuesta: respuesta, codigo, nombreGrupo, admon })
                    } else {

                        var admon = 0;
                        res.render('grupos1', { respuesta: respuesta, codigo, nombreGrupo, admon })
                    }


                }
            })
        } catch (error) {
            console.log(error)
            res.redirect('/grupos')
        }
    } else {
        console.log('NO hay sesion activa Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }

})




//crear un grupo

app.post('/crearGrupo1', (req, res) => {
    //crear un grupo
    var nombreGrupo = req.body.nombreGrupo;

    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = null;

    //insertar en grupos
    connection.query('INSERT INTO CGrupos SET ?', { idCgrupos: idCgrupo, Nombre_Grupo: nombreGrupo, estadoGrupo: 0, adminID: idPersona }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {

            //obtener el codigo generado
            connection.query("SELECT LAST_INSERT_ID() as 'idCgrupos' ", (error, respuesta, field) => {
                console.log("el identificador del grupo es : " + respuesta[0].idCgrupos)
                var codigo = respuesta[0].idCgrupos;

                //relacionar la persona con el grupo en

                connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Usuario y grupo conectados con exito')
                        // res.redirect('/login')
                    }

                })


            })

            res.redirect('/grupo')
            console.log('grupo Registrado con exito')
        }

    })

})


//unirse a un grupoo

app.post('/unirseGrupo1', (req, res) => {

    if (req.session.loggedin) {
        console.log('Sesion creada y existente-unirse grupo1')

        //codigo con el q se une
        var codigo = req.body.codigo;

        //obtener esta id de la sesion
        var idPersona = req.session.idPersona;

        //Validar q la persona no este en el grupo
        connection.query('select  * from persona_has_cgrupos where CGrupos_idCGrupos = ' + codigo + '', (error, results) => {
            if (error) throw error;
            try {
                var integrante = results[0].persona_idPersona;
                console.log('el integrante es: ' + integrante)

                if (idPersona === integrante) {
                    console.log('la persona ya esta en el grupo')
                    res.redirect('/grupo')
                } else {

                    //Relacionar person y grupo
                    connection.query('INSERT INTO persona_has_cgrupos SET ?', { Persona_Grupoid: null, persona_idPersona: idPersona, CGrupos_idCGrupos: codigo }, async (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Usuario y grupo relacionados con exito')
                            res.redirect('/grupo')
                        }

                    })
                }

            } catch (error) {
                console.log(error)
                res.redirect('/grupo')
            }
        })


    } else {
        console.log('NO hay sesion activa-Login')
        res.render('login', {
            login: false,
            name: 'Inicie Sesion'
        })
    }


})

// borrar Grupo
app.post('/borrarGrupo', (req, res) => {

    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = req.body.codigo;
    console.log('idGrupo:' + idCgrupo)
    //borrar en tabla relacional
    connection.query('delete from persona_has_cgrupos where CGrupos_idCGrupos = ?;', [idCgrupo], async (error, results) => {
        if (error) {
            console.log(error);
        } else {


            console.log('grupo borrado de tabla relacional con exito')

        }

    })

    //-borrar de grupos
    connection.query('delete from CGrupos where idCGrupos = ?;', [idCgrupo], async (error, results) => {
        if (error) {
            console.log(error);
        } else {


            console.log('grupo borrado con exito')


        }

    })
    res.redirect('/grupo');

})


//salir del grupo
app.post('/salirGrupo', (req, res) => {

    //este id se obtiene de la sesion
    var idPersona = req.session.idPersona;
    var idCgrupo = req.body.codigo;

    connection.query('delete from persona_has_cgrupos where CGrupos_idCGrupos = ? and persona_idPersona = ? ;', [idCgrupo, idPersona], async (error, results) => {
        if (error) {
            console.log(error);
        } else {


            console.log('persona salio del grupo con exito')

        }

    })

    res.redirect('/grupo');

})



//DEPLOY EN EL PUERTO
app.listen(PORT, (req, res) => {
    console.log('Escuchando desde el puerto 3150');

})
