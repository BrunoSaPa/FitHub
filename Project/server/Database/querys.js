export const querys = {
  //Usuarios
    getUsers: "SELECT * FROM Usuario",
    getUserById: "SELECT Usuario.*, UsuarioMovil.ComparacionRendimiento, UsuarioMovil.ViajeGimnasio FROM Usuario LEFT JOIN UsuarioMovil ON Usuario.ID_Usuario = UsuarioMovil.ID_Usuario WHERE Usuario.ID_Usuario = @ID_Usuario",
    checkUserExists: "SELECT ID_Usuario FROM Usuario WHERE ID_Usuario = @oid",
    createUser:  "INSERT INTO Usuario (ID_Usuario, nombre_usuario, nombre, apellido, correo, sexo, fecha_nacimiento) VALUES (@oid, @username, @givenName, @surname, @email, @gender, @dateOfBirth)",
    getBirthDate: "SELECT fecha_nacimiento, sexo FROM Usuario WHERE ID_Usuario = @ID_Usuario",
    getUserAndType: "SELECT Usuario.*, CASE WHEN Usuario_WEB.ID_Usuario IS NOT NULL THEN 'Web' WHEN UsuarioMovil.ID_Usuario IS NOT NULL THEN 'Móvil' ELSE 'Ninguno' END AS TipoDeUsuario, COALESCE(tipo_web.tipo, tipo.Descripcion) AS DescripcionTipo FROM Usuario LEFT JOIN Usuario_WEB ON Usuario.ID_Usuario = Usuario_WEB.ID_Usuario LEFT JOIN tipo_web ON Usuario_WEB.ID_Tipo_WEB = tipo_web.ID_Tipo_Web LEFT JOIN UsuarioMovil ON Usuario.ID_Usuario = UsuarioMovil.ID_Usuario LEFT JOIN tipo ON UsuarioMovil.ID_Tipo = tipo.ID_Tipo",

    //Usuario Movil
    createMovileUser: "INSERT INTO UsuarioMovil (ID_Tipo, ID_Usuario, ComparacionRendimiento, ViajeGimnasio) VALUES (1, @ID_Usuario, 1, 1)",    
    getMobileUser: "SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario",
    updateViajeGimnasio: "UPDATE UsuarioMovil SET ViajeGimnasio = @viaje WHERE ID_UsuarioMovil = @ID_UsuarioMovil", 
    updateCompracionRendimiento: "UPDATE UsuarioMovil SET ComparacionRendimiento = @comparacion WHERE ID_UsuarioMovil = @ID_UsuarioMovil",

    //UsuarioWeb
    getWebUser: "SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario",

    //Equipo
    getMaterials: "SELECT equipo FROM Equipo",
    getMaterialByName: "SELECT ID_Equipo FROM Equipo WHERE equipo = @nombre",

    //Cuestionario
    createCuestionario: "INSERT INTO Cuestionario (ID_UsuarioMovil, tiempo_disponible, ID_Objetivo, ID_NivelFormaFisica, ID_EspacioDisponible, ID_Musculo ) OUTPUT INSERTED.ID_Cuestionario VALUES (@ID_UsuarioMovil, @tiempo_disponible, @ID_Objetivo, @ID_NivelFormaFisica, @ID_EspacioDisponible, @ID_Musculo)",

    //Espacio
    getSpaceByName: "SELECT ID_EspacioDisponible FROM EspacioDisponible WHERE espacio_disponible = @nombre",

    //PuedeEntrenar
    createPuedeEntrenar: "INSERT INTO PuedeEntrenar (ID_Cuestionario, ID_Dia) VALUES (@ID_Cuestionario, @ID_Dia)",
    createPadece: "INSERT INTO Padece (ID_Cuestionario, ID_Lesion) VALUES (@ID_Cuestionario, @ID_Lesion)",
    createDispone: "INSERT INTO Dispone (ID_Cuestionario, ID_Equipo) VALUES (@ID_Cuestionario, @ID_Equipo)",

    //QuiereEntrenar
    createQuiereEntrenar:"INSERT INTO QuiereEntrenar (ID_Dia, ID_Musculo, ID_Cuestionario) OUTPUT INSERTED.ID_QuiereEntrenar VALUES (@ID_Dia, @ID_Musculo, @ID_Cuestionario) ",
    createQuiereEntrenarDia:"INSERT INTO QuiereEntrenarDia (ID_Dia, ID_Musculo) OUTPUT INSERTED.ID_QuiereEntrenarDia VALUES (@ID_Dia, @ID_Musculo)",

    //Ejercicio
    createEjercicio: "INSERT INTO Ejercicio (ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, estado) OUTPUT INSERTED.ID_Ejercicio VALUES (@ejercicio, @preparacion, @ejecucion, @ID_Musculo, @ID_Tipo_Ejercicio, @ID_Dificultad, @ID_Equipo, @ID_Modalidad, @ID_Lesion, 1)",
    requestEjercicio: "INSERT INTO Ejercicio (ejercicio, preparacion, ejecucion, ID_Musculo, ID_Tipo_Ejercicio, ID_Dificultad, ID_Equipo, ID_Modalidad, ID_Lesion, estado) OUTPUT INSERTED.ID_Ejercicio VALUES (@ejercicio, @preparacion, @ejecucion, @ID_Musculo, @ID_Tipo_Ejercicio, @ID_Dificultad, @ID_Equipo, @ID_Modalidad, @ID_Lesion, 0)",
    updateEjercicio:`UPDATE Ejercicio SET ejercicio = @ejercicio, preparacion = @preparacion, ejecucion = @ejecucion, ID_Musculo = @ID_Musculo,
    ID_Tipo_Ejercicio = @ID_Tipo_Ejercicio, ID_Dificultad = @ID_Dificultad, ID_Equipo = @ID_Equipo, ID_Modalidad = @ID_Modalidad, ID_Lesion = @ID_Lesion WHERE ID_Ejercicio = @ID_Ejercicio`,
    updateRequest:`UPDATE Ejercicio SET ejercicio = @ejercicio, preparacion = @preparacion, ejecucion = @ejecucion, ID_Musculo = @ID_Musculo,
    ID_Tipo_Ejercicio = @ID_Tipo_Ejercicio, ID_Dificultad = @ID_Dificultad, ID_Equipo = @ID_Equipo, ID_Modalidad = @ID_Modalidad, ID_Lesion = @ID_Lesion, estado = 1 WHERE ID_Ejercicio = @ID_Ejercicio`,
    getEjercicios: "SELECT E.ID_Ejercicio, E.ejecucion, E.ejercicio, E.preparacion, D.dificultad AS Dificultad, M.modalidad AS Modalidad, Mu.descripcion AS Musculo, TE.descripcion AS Tipo_Ejercicio, EQ.equipo AS Equipo, L.lesion AS Lesion FROM Ejercicio E LEFT JOIN Dificultad D ON E.ID_Dificultad = D.ID_Dificultad LEFT JOIN Modalidad M ON E.ID_Modalidad = M.ID_Modalidad LEFT JOIN Musculo Mu ON E.ID_Musculo = Mu.ID_Musculo LEFT JOIN Tipo_Ejercicio TE ON E.ID_Tipo_Ejercicio = TE.ID_Tipo_Ejercicio LEFT JOIN Equipo EQ ON E.ID_Equipo = EQ.ID_Equipo LEFT JOIN Lesion L ON E.ID_Lesion = L.ID_Lesion WHERE E.estado = 1;",
    getRequests: "SELECT E.ID_Ejercicio, E.ejecucion, E.ejercicio, E.preparacion, D.dificultad AS Dificultad, M.modalidad AS Modalidad, Mu.descripcion AS Musculo, TE.descripcion AS Tipo_Ejercicio, EQ.equipo AS Equipo, L.lesion AS Lesion FROM Ejercicio E LEFT JOIN Dificultad D ON E.ID_Dificultad = D.ID_Dificultad LEFT JOIN Modalidad M ON E.ID_Modalidad = M.ID_Modalidad LEFT JOIN Musculo Mu ON E.ID_Musculo = Mu.ID_Musculo LEFT JOIN Tipo_Ejercicio TE ON E.ID_Tipo_Ejercicio = TE.ID_Tipo_Ejercicio LEFT JOIN Equipo EQ ON E.ID_Equipo = EQ.ID_Equipo LEFT JOIN Lesion L ON E.ID_Lesion = L.ID_Lesion WHERE E.estado = 0;",
    getEjerciciosById: "SELECT * FROM Ejercicio WHERE ID_Ejercicio = @ID_Ejercicio",
    getAlternativas: "SELECT E.ID_Ejercicio, E.ejecucion, E.ejercicio, E.preparacion, D.dificultad AS Dificultad, M.modalidad AS Modalidad, Mu.descripcion AS Musculo, TE.descripcion AS Tipo_Ejercicio, EQ.equipo AS Equipo FROM (SELECT TOP 3 Ejercicio.* FROM Ejercicio JOIN Musculo ON Ejercicio.ID_Musculo = Musculo.ID_Musculo WHERE Musculo.descripcion = @ID_Musculo ORDER BY NEWID()) AS E JOIN Dificultad D ON E.ID_Dificultad = D.ID_Dificultad JOIN Modalidad M ON E.ID_Modalidad = M.ID_Modalidad JOIN Musculo Mu ON E.ID_Musculo = Mu.ID_Musculo JOIN Tipo_Ejercicio TE ON E.ID_Tipo_Ejercicio = TE.ID_Tipo_Ejercicio LEFT JOIN Equipo EQ ON E.ID_Equipo = EQ.ID_Equipo",
    updateEstado: "UPDATE Ejercicio SET estado = 1 WHERE ID_Ejercicio = @ID_Ejercicio",
    deleteEjercicio: "DELETE FROM Ejercicio WHERE ID_Ejercicio = @ID_Ejercicio",

    //Tambien Entrena
    createTambienEntrena: "INSERT INTO TambienEntrena (ID_Musculo, ID_Ejercicio) VALUES (@ID_Musculo, @ID_Ejercicio)",
    getMusculosSecundarios: `
    SELECT M.descripcion FROM TambienEntrena TE JOIN Musculo M ON TE.ID_Musculo = M.ID_Musculo WHERE TE.ID_Ejercicio = @ID_Ejercicio`,
    getMusculosSecs: "SELECT ID_Musculo FROM TambienEntrena WHERE ID_Ejercicio = @ID_Ejercicio",
    

    //Alimentos
    createAlimento: "INSERT INTO Alimento(nombre, calorias, peso, ID_Categoria, estado) OUTPUT INSERTED.ID_Alimento VALUES (@nombre, @calorias, @peso, @ID_Categoria, 1)",
    createAlimentoRequest: "INSERT INTO Alimento(nombre, calorias, peso, ID_Categoria, estado) OUTPUT INSERTED.ID_Alimento VALUES (@nombre, @calorias, @peso, @ID_Categoria, 0)",
    getAlimento:"select a.ID_Alimento, a.nombre, a.calorias, a.peso, c.categoria from Alimento as a JOIN categoria as c ON a.ID_Categoria = c.ID_Categoria WHERE estado = 1",
    getAlimentoRequest:"select a.ID_Alimento, a.nombre, a.calorias, a.peso, c.categoria from Alimento as a JOIN categoria as c ON a.ID_Categoria = c.ID_Categoria WHERE estado = 0",
    getAlimentoById: "SELECT * FROM Alimento WHERE ID_Alimento = @ID_Alimento",
    updateAlimento: `UPDATE Alimento SET nombre = @nombre, calorias = @calorias, peso = @peso, ID_Categoria = @ID_Categoria WHERE ID_Alimento = @ID_Alimento`,
    updateAlimentoRequest: `UPDATE Alimento SET nombre = @nombre, calorias = @calorias, peso = @peso, ID_Categoria = @ID_Categoria, estado = 1 WHERE ID_Alimento = @ID_Alimento`,
    upadateEstadoAlimento: "UPDATE Alimento SET estado = 1 WHERE ID_Alimento = @ID_Alimento",
    deleteAlimento: "DELETE FROM Alimento WHERE ID_Alimento = @ID_Alimento",
  
    //Contiene (Macronutrientes del alimento)
    createContiene: "INSERT INTO Contiene(ID_Alimento, ID_Macronutriente, cantidad) VALUES (@ID_Alimento, @ID_Macronutriente, @cantidad)",
    getContiene: "select m.macronutriente, c.cantidad from Macronutriente as M join Contiene as c ON c.ID_Macronutriente = m.ID_Macronutriente where ID_Alimento=@ID_Alimento",
    updateContiene: `UPDATE Contiene SET cantidad = @cantidad WHERE ID_Alimento = @ID_Alimento AND ID_Macronutriente = @ID_Macronutriente`,
    getContieneById: "SELECT ID_Macronutriente, cantidad FROM Contiene WHERE ID_Alimento = @ID_Alimento",

    //Recetas
    createReceta: "INSERT INTO Receta (receta, calorias, preparacion, link, estado) OUTPUT INSERTED.ID_Receta VALUES (@receta, @calorias, @preparacion, @link, 1)",
    requestReceta: "INSERT INTO Receta (receta, calorias, preparacion, link, estado) OUTPUT INSERTED.ID_Receta VALUES (@receta, @calorias, @preparacion, @link, 0)",
    getReceta: "SELECT ID_Receta, receta, calorias, preparacion, link FROM Receta WHERE estado = 1",
    getRecetaRequests: "SELECT ID_Receta, receta, calorias, preparacion, link FROM Receta WHERE estado = 0",
    updateReceta: `UPDATE Receta SET receta = @receta, calorias = @calorias, preparacion = @preparacion, link = @link WHERE ID_Receta = @ID_Receta`,
    updateAndAcceptReceta: `UPDATE Receta SET receta = @receta, calorias = @calorias, preparacion = @preparacion, link = @link, estado=1 WHERE ID_Receta = @ID_Receta`,
    updateEstadoReceta: "UPDATE Receta SET estado = 1 WHERE ID_Receta = @ID_Receta",
    deleteReceta: "DELETE FROM Receta WHERE ID_Receta = @ID_Receta",

    //TieneIngredientes
    createTieneIngredientes: "INSERT INTO TieneIngredientes(ID_Receta, ID_Alimento, porcion) VALUES (@ID_Receta, @ID_Alimento, @porcion)",
    getIngredientes: "SELECT a.nombre, i.porcion FROM TieneIngredientes AS i JOIN Alimento as a ON a.ID_Alimento = i.ID_Alimento WHERE ID_Receta = @ID_Receta",
    getIngredientesById: "SELECT ID_Alimento, porcion FROM TieneIngredientes WHERE ID_Receta = @ID_Receta",
    deleteIngredientesByReceta: "DELETE FROM TieneIngredientes WHERE ID_Receta = @ID_Receta",

    //Clasficiacion Recetas
    createClasificaReceta: "INSERT INTO ClasificaReceta(ID_Receta, ID_Clasificacion) VALUES (@ID_Receta, @ID_Clasificacion)",  
    getClasificaReceta: "SELECT c.clasificacion FROM ClasificaReceta AS ca JOIN Clasificacion as c ON ca.ID_Clasificacion = c.ID_Clasificacion WHERE ID_Receta = @ID_Receta",
    deleteClasificaReceta: "DELETE FROM ClasificaReceta WHERE ID_Receta = @ID_Receta",

    //Obtiene
    createObtiene: "INSERT INTO Obtiene (ID_Receta, ID_Macronutriente, cantidad) VALUES (@ID_Receta, @ID_Macronutriente, @cantidad)",
    getObtiene: "SELECT ID_Macronutriente, cantidad FROM Obtiene WHERE ID_Receta = @ID_Receta",
    deleteObtieneByReceta: "DELETE FROM Obtiene WHERE ID_Receta = @ID_Receta",

    //Rutinas
    createRutina: "INSERT INTO Rutina(publica, ID_Dificultad, ID_NivelFormaFisica, ID_Objetivo, duracion, ID_Usuario)  OUTPUT INSERTED.ID_Rutina VALUES (0, @ID_Dificultad, @ID_NivelFormaFisica, 1, @duracion, @ID_Usuario)",
    createRutinaShort: "INSERT INTO Rutina(nombre, ID_Usuario) OUTPUT INSERTED.ID_Rutina VALUES (@nombre, @ID_Usuario)",
    getRutinasByUsuario: "SELECT R.ID_Rutina, R.nombre AS NombreRutina, U.nombre_usuario AS Autor FROM Rutina R INNER JOIN Usuario U ON R.ID_Usuario = U.ID_Usuario WHERE R.ID_Usuario = @ID_Usuario",
    getRutinaByID: "SELECT * FROM Rutina WHERE ID_Rutina = @ID_Rutina",
    updateRutina: "UPDATE Rutina SET nombre = @nombre, publica = @publica WHERE ID_Rutina = @ID_Rutina",

    //Dias_Entreno
    createDiasEntreno: "INSERT INTO Dias_Entreno(ID_Rutina, ID_Dia)  OUTPUT INSERTED.ID_Dias_Entreno VALUES (@ID_Rutina, @ID_Dia)",
    getDiasEntrenoByRutina: "SELECT DE.ID_Dias_Entreno, DE.ID_Dia, D.dia FROM Dias_Entreno DE INNER JOIN Dia D ON DE.ID_Dia = D.ID_Dia WHERE DE.ID_Rutina = @ID_Rutina",
    deleteDiasEntrenoByRutina: "DELETE FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina",

    //EjerciciosDia
    createEjerciciosDia: "INSERT INTO EjerciciosDia (ID_Dias_Entreno, ID_Ejercicio, descanso, superset)  OUTPUT INSERTED.ID_EjerciciosDia VALUES (@ID_Dias_Entreno, @ID_Ejercicio, @descanso, @superset)",
    getEjerciciosPorDia: "SELECT e.ID_Ejercicio, e.ejercicio, DATEDIFF(SECOND, '00:00:00', CAST(ed.descanso AS TIME)) AS descanso, ed.superset, ed.ID_EjerciciosDia FROM Ejercicio AS e JOIN EjerciciosDia AS ed ON e.ID_Ejercicio = ed.ID_Ejercicio WHERE ed.ID_Dias_Entreno = @ID_Dias_Entreno;",

    //BloqueSets
    createBloqueSets: "INSERT INTO BloqueSets (ID_EjerciciosDia) VALUES (@ID_EjerciciosDia)",

    //ConjuntoSeries
    createConjuntoSeries: "INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Series) VALUES (@ID_BloqueSets, @ID_Series)",

    //Serie
    createSerie: "INSERT INTO (ID_Ejercicio, tiempo_ejercicio_cardiovascular, descanso, repeticiones) VALUES (@ID_Ejercicio, @tiempo_ejercicio_cardiovascular, @descanso, @repeticiones)",

    //Dietas
    getTiemposComida: "SELECT * FROM TiempoComida",

    //AsignarRutinas
    createAsignarRutinas: "INSERT INTO Rutina_Asignada (fecha_asignacion, fecha_eliminacion, fecha_inicio, fecha_fin, Hora_Inicio, ID_Rutina, ID_UsuarioMovil, ID_Usuario_WEB) OUTPUT INSERTED.ID_Rutina_Asignada VALUES (@fecha_asignacion, @fecha_eliminacion, @fecha_inicio, @fecha_fin , NULL, @ID_Rutina, @ID_UsuarioMovil, @ID_Usuario_WEB)",
    
    //Citas
    createCita: `INSERT INTO Cita (ID_UsuarioMovil, ID_Usuario_WEB, fecha, hora_inicio, hora_final, lugar, detalles, ID_EstadoCita) VALUES (@ID_UsuarioMovil, @ID_Usuario_WEB, @fecha, @hora_inicio, @hora_final, @lugar, @detalles, 1); SELECT SCOPE_IDENTITY() as ID_Cita;`,
    getCitas: `SELECT C.ID_Cita, CONVERT(char(10), C.fecha, 126) as fecha, 
    CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, 
    CONVERT(varchar, C.hora_final, 108) as hora_final, C.lugar, C.detalles, c.ID_UsuarioMovil, EC.estado, U.nombre, U.apellido, U.ID_Usuario FROM Cita C INNER JOIN EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita INNER JOIN UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario WHERE C.ID_Usuario_WEB = @ID_Usuario_WEB AND C.ID_EstadoCita IN (1, 2)`,
    getAceptadasCitas: `SELECT C.ID_Cita, CONVERT(char(10), C.fecha, 126) as fecha, 
    CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, 
    CONVERT(varchar, C.hora_final, 108) as hora_final, C.lugar, C.detalles, c.ID_UsuarioMovil, EC.estado, U.nombre, U.apellido, U.ID_Usuario FROM Cita C INNER JOIN EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita INNER JOIN UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario WHERE C.ID_Usuario_WEB = @ID_Usuario_WEB AND C.ID_EstadoCita=4`,
    getPendingCitas: "SELECT C.ID_Cita, CONVERT(char(10), C.fecha, 126) as fecha, CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, CONVERT(varchar, C.hora_final, 108) as hora_final,  C.lugar, C.detalles, EC.estado, UM.ID_UsuarioMovil, U.nombre AS nombre_usuario_movil, U.apellido AS apellido_usuario_movil, U2.nombre AS nombre_usuario_web, U2.apellido AS apellido_usuario_web, TUW.tipo AS Tipo_Web FROM Cita C INNER JOIN EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita INNER JOIN UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario INNER JOIN Usuario_WEB UW ON C.ID_Usuario_WEB = UW.ID_Usuario_WEB INNER JOIN Usuario U2 ON UW.ID_Usuario = U2.ID_Usuario LEFT JOIN Tipo_Web TUW ON UW.ID_Tipo_WEB = TUW.ID_Tipo_WEB WHERE C.ID_UsuarioMovil = @ID_UsuarioMovil AND C.ID_EstadoCita = 1;",
    getAcceptedCitasMobile: "SELECT C.ID_Cita, CONVERT(char(10), C.fecha, 126) as fecha, CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, CONVERT(varchar, C.hora_final, 108) as hora_final,  C.lugar, C.detalles, EC.estado, UM.ID_UsuarioMovil, U.nombre AS nombre_usuario_movil, U.apellido AS apellido_usuario_movil, U2.nombre AS nombre_usuario_web, U2.apellido AS apellido_usuario_web, TUW.tipo AS Tipo_Web FROM Cita C INNER JOIN EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita INNER JOIN UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario INNER JOIN Usuario_WEB UW ON C.ID_Usuario_WEB = UW.ID_Usuario_WEB INNER JOIN Usuario U2 ON UW.ID_Usuario = U2.ID_Usuario LEFT JOIN Tipo_Web TUW ON UW.ID_Tipo_WEB = TUW.ID_Tipo_WEB WHERE C.ID_UsuarioMovil = @ID_UsuarioMovil AND C.ID_EstadoCita = 2;",
    getRejectedCitas: `SELECT C.ID_Cita,CONVERT(char(10), C.fecha, 126) as fecha, CONVERT(varchar, C.hora_inicio, 108) as hora_inicio, CONVERT(varchar, C.hora_final, 108) as hora_final, C.lugar, C.detalles, c.ID_UsuarioMovil, EC.estado, U.nombre, U.apellido, U.ID_Usuario FROM Cita C INNER JOIN EstadoCita EC ON C.ID_EstadoCita = EC.ID_EstadoCita INNER JOIN UsuarioMovil UM ON C.ID_UsuarioMovil = UM.ID_UsuarioMovil INNER JOIN Usuario U ON UM.ID_Usuario = U.ID_Usuario WHERE C.ID_Usuario_WEB = @ID_Usuario_WEB AND C.ID_EstadoCita IN (3, 5)`,
    updateAceptarCita: `UPDATE Cita SET ID_EstadoCita = 2 WHERE ID_Cita = @ID_Cita`,
    updatePendienteCita: `UPDATE Cita SET ID_EstadoCita = 1 WHERE ID_Cita = @ID_Cita`,
    updateRechazarCita: `UPDATE Cita SET ID_EstadoCita = 3 WHERE ID_Cita = @ID_Cita`,
    updateCompletarCita: `UPDATE Cita SET ID_EstadoCita = 4 WHERE ID_Cita = @ID_Cita`,
    updateCancelarCita: `UPDATE Cita SET ID_EstadoCita = 5 WHERE ID_Cita = @ID_Cita`,
    updateCita: `UPDATE Cita SET ID_UsuarioMovil = @ID_UsuarioMovil, ID_Usuario_WEB = @ID_Usuario_WEB, fecha = @fecha, hora_inicio = @hora_inicio, hora_final = @hora_final, lugar = @lugar, detalles = @detalles, ID_EstadoCita = @ID_EstadoCita WHERE ID_Cita = @ID_Cita`,

    //Entrenamiento
    getWorkoutSessionDetails: "SELECT RSU.ID_ResultadoSeriesUsuario, RSU.ID_Serie, S.repeticiones, S.peso, CASE WHEN S.tiempo = '00:00:00' THEN NULL ELSE CONVERT(varchar, DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', S.tiempo), 0), 108) END AS tiempo, DATEDIFF(SECOND, '00:00:00', ED.descanso) AS descansoEnSegundos, S.ID_SeriePrincipal, E.ID_Ejercicio, E.ejercicio AS nombreEjercicio, D.dificultad AS Dificultad, ED.superset, M.descripcion AS Musculos, E.preparacion, E.ejecucion AS indicaciones, EQ.equipo AS material, TE.descripcion AS Tipo_Ejercicio, L.lesion AS Lesion, TM.modalidad AS Modalidad FROM ResultadoSeriesUsuario RSU LEFT JOIN Serie S ON RSU.ID_Serie = S.ID_Serie LEFT JOIN ConjuntoSeries CS ON S.ID_Serie = CS.ID_Serie LEFT JOIN BloqueSets BS ON CS.ID_BloqueSets = BS.ID_BloqueSets LEFT JOIN EjerciciosDia ED ON BS.ID_EjerciciosDia = ED.ID_EjerciciosDia LEFT JOIN Dias_Entreno DE ON ED.ID_Dias_Entreno = DE.ID_Dias_Entreno LEFT JOIN Ejercicio E ON ED.ID_Ejercicio = E.ID_Ejercicio LEFT JOIN Dificultad D ON E.ID_Dificultad = D.ID_Dificultad LEFT JOIN Musculo M ON E.ID_Musculo = M.ID_Musculo LEFT JOIN Tipo_Ejercicio TE ON E.ID_Tipo_Ejercicio = TE.ID_Tipo_Ejercicio LEFT JOIN Equipo EQ ON E.ID_Equipo = EQ.ID_Equipo LEFT JOIN Lesion L ON E.ID_Lesion = L.ID_Lesion LEFT JOIN Modalidad TM ON E.ID_Modalidad = TM.ID_Modalidad WHERE RSU.fecha = '2024-04-01' AND RSU.ID_Rutina_Asignada IN (SELECT ID_Rutina_Asignada FROM Rutina_Asignada WHERE ID_UsuarioMovil = 4068)  ",
};