import { getConnection } from "../Database/connection.js";
import { sql } from "../Database/connection.js";
import { querys } from "../Database/querys.js";


  export const createCompleteRutinaForClient = async (req, res) => {
    const { ID_Usuario, ID_Movil, routineName, days, fechaInicio, fechaFin } = req.body;
    try {
      console.log(req.body);
      const pool = await getConnection();

      const mobileUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Movil)
      .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");

    const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;

    // Consulta para obtener el ID de usuario web
    const webUserResult = await pool
      .request()
      .input("ID_Usuario", sql.VarChar, ID_Usuario)
      .query("SELECT ID_Usuario_WEB FROM Usuario_WEB WHERE ID_Usuario = @ID_Usuario");

    const ID_Usuario_WEB = webUserResult.recordset[0].ID_Usuario_WEB;
  
      // Insertar la nueva rutina
      const insertRutinaResult = await pool
        .request()
        .input("nombre", sql.NVarChar, routineName)
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query(querys.createRutinaShort);
      const rutinaId = insertRutinaResult.recordset[0].ID_Rutina;
      console.log("Rutina insertada");
      // Variables para calcular la dificultad y duración
  
  
      // Iterar sobre cada día para insertar ejercicios y sets
      for (const day of days) {
        // Insertar día de entrenamiento y obtener ID_Dia
        const insertDiaResult = await pool
          .request()
          .input("ID_Rutina", sql.Int, rutinaId)
          .input("ID_Dia", sql.Int, day.ID_Dia)
          .query(querys.createDiasEntreno); // Asegúrate de tener esta consulta preparada en tus 'querys'
        const ID_Dia = insertDiaResult.recordset[0].ID_Dias_Entreno;
        
  
        // Iterar sobre cada ejercicio del día
        for (const ejercicio of day.ejercicios) {
  
          const descansoEnSegundos = ejercicio.DescansoEnSegundos; // Por ejemplo, 90 segundos
          console.log(descansoEnSegundos);
  
          // Convertir segundos a un string en formato HH:MM:SS para SQL TIME
          let horas = Math.floor(descansoEnSegundos / 3600).toString().padStart(2, '0');
          let minutos = Math.floor((descansoEnSegundos % 3600) / 60).toString().padStart(2, '0');
          let segundos = (descansoEnSegundos % 60).toString().padStart(2, '0');
          let descansoComoTime = `${horas}:${minutos}:${segundos}.0000000`;
          console.log(descansoComoTime);
  
          console.log(ejercicio);
          console.log(ejercicio.sets);
          // Insertar EjercicioDia
          const insertEjercicioDiaResult = await pool
            .request()
            .input(
              "ID_Dias_Entreno",
              sql.Int,
              ID_Dia
            )
            .input("ID_Ejercicio", sql.Int, ejercicio.ID_Ejercicio[0])
            .input("descanso", sql.Time, descansoComoTime)
            .input("superset", sql.Bit, ejercicio.superset ? 1 : 0) // Asumiendo que 'isSuperset' es un booleano
            .query(querys.createEjerciciosDia);
  
          const ID_EjercicioDia =
            insertEjercicioDiaResult.recordset[0].ID_EjerciciosDia;
  
          const resultBloqueSets = await pool
          .request()
          .input("ID_EjerciciosDia", sql.Int, ID_EjercicioDia)
          .query(
            "INSERT INTO BloqueSets (ID_EjerciciosDia) OUTPUT INSERTED.ID_BloqueSets VALUES (@ID_EjerciciosDia);"
          );
          const ID_BloqueSets = resultBloqueSets.recordset[0].ID_BloqueSets;
  
          // Iterar sobre cada set del ejercicio
          let lastSetId = null;
  
          for (const conjunto of ejercicio.bloqueSets) {
            // Aquí podrías insertar o manejar la lógica para ConjuntoSeries si es necesario
          
            for (const bloque of conjunto.conjuntoSeries) {
              // Aquí insertas o manejas BloqueSets
          
              for (const set of bloque.series) {            
                let idSerieActual; 
          
            if (!set.isDropSet) {
              // Insertar el set principal y obtener su ID
              const resultSerie = await pool.request()
                .input("repeticiones", sql.Int, set.repeticiones)
                .input("peso", sql.Decimal(10, 2), set.peso) // Asumiendo que peso puede ser decimal
                .input("ID_EjerciciosDia", sql.Int, ID_EjercicioDia)
                .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, NULL); SELECT SCOPE_IDENTITY() AS ID_Serie;");
              idSerieActual = resultSerie.recordset[0].ID_Serie; // Guardar el ID de la serie actual
              lastSetId = idSerieActual; // Actualizar lastSetId para ser usado en drop sets
            } else {
              // Insertar el drop set y obtener su ID
              const resultSerie = await pool.request()
                .input("repeticiones", sql.Int, set.repeticiones)
                .input("peso", sql.Decimal(10, 2), set.peso)
                .input("ID_SeriePrincipal", sql.Int, lastSetId) // Usar lastSetId para relacionar el dropset con su set principal
                .query("INSERT INTO Serie (repeticiones, peso, tiempo, ID_SeriePrincipal) VALUES (@repeticiones, @peso, NULL, @ID_SeriePrincipal); SELECT SCOPE_IDENTITY() AS ID_Serie;");
              idSerieActual = resultSerie.recordset[0].ID_Serie; // Guardar el ID de la serie actual
            }
          
            // Inmediatamente después de insertar la serie, insertar la relación en ConjuntoSeries
            await pool.request()
              .input("ID_BloqueSets", sql.Int, ID_BloqueSets)
              .input("ID_Serie", sql.Int, idSerieActual) // Usar el ID de la serie actual
              .query("INSERT INTO ConjuntoSeries (ID_BloqueSets, ID_Serie) VALUES (@ID_BloqueSets, @ID_Serie);");
          }
  
          // Actualizar la dificultad del ejercicio en la base de datos
          // Asegúrate de tener una columna para la dificultad en tu esquema de EjercicioDia
          // await pool
          //   .request()
          //   .input("ID_EjercicioDia", sql.Int, ID_EjercicioDia)
          //   .input("Dificultad", sql.Int, dificultadEjercicio)
          //   .query(querys.updateDificultadEjercicioDia);
  
          // totalEjercicios += 1;
          // totalDificultad += dificultadEjercicio;
        }
      }
    }
  }
  
     
      // Calcular y actualizar la dificultad y duración promedio de la rutina
  
      const ID_Rutina = rutinaId;
  
      const resultadoDuracion = await pool
          .request()
          .input("ID_Rutina", sql.Int, ID_Rutina) // Asegúrate de que esta variable se declara correctamente aquí
          .query(`
      WITH DuracionPorDia AS (
        SELECT
            ED.ID_Dias_Entreno,
            SUM((S.repeticiones * 2) + DATEDIFF(SECOND, '00:00:00', ED.descanso)) AS DuracionTotal
        FROM
            EjerciciosDia ED
            INNER JOIN BloqueSets BS ON ED.ID_EjerciciosDia = BS.ID_EjerciciosDia
            INNER JOIN ConjuntoSeries CS ON BS.ID_BloqueSets = CS.ID_BloqueSets
            INNER JOIN Serie S ON CS.ID_Serie = S.ID_Serie
        GROUP BY
            ED.ID_Dias_Entreno
    )
    SELECT
        AVG(DuracionTotal) AS PromedioDuracion
    FROM
        DuracionPorDia;
      `);
  
        console.log(
          "Resultado de calcular duración promedio:",
          resultadoDuracion.recordset
        );
        if (resultadoDuracion.recordset.length > 0) {
          const duracionPromedio =
            resultadoDuracion.recordset[0].PromedioDuracion;
  
          // Actualiza la duración en la rutina
          await pool
            .request()
            .input("ID_Rutina", sql.Int, ID_Rutina)
            .input("duracion", sql.Float, duracionPromedio) // Asegúrate de que el tipo de dato sea correcto
            .query(`
          UPDATE Rutina
          SET duracion = @duracion
          WHERE ID_Rutina = @ID_Rutina;
        `);
        }
  
        const diasEntrenoResult = await pool
        .request()
        .input("ID_Rutina", sql.Int, ID_Rutina)
        .query(
          "SELECT ID_Dias_Entreno FROM Dias_Entreno WHERE ID_Rutina = @ID_Rutina"
        );
  
      const idsDiasEntreno = diasEntrenoResult.recordset.map(
        (row) => row.ID_Dias_Entreno
      );
  
      const inClause = idsDiasEntreno.join(",");
  
      // Ejecuta la consulta con la cláusula IN construida dinámicamente
      const resultadoDificultadQuery = `
        SELECT E.ID_Dificultad, COUNT(*) AS Cantidad
        FROM Ejercicio E
        JOIN EjerciciosDia ED ON E.ID_Ejercicio = ED.ID_Ejercicio
        WHERE ED.ID_Dias_Entreno IN (${inClause})
        GROUP BY E.ID_Dificultad
      `;
  
      const resultadoDificultad = await pool
        .request()
        .query(resultadoDificultadQuery);
      console.log("No llegue aqui");
  
      let valorNivel = 0;
      let totalEjercicios = 0;
      resultadoDificultad.recordset.forEach((row) => {
        totalEjercicios += row.Cantidad;
        if (row.ID_Dificultad === 1) {
          // Suponiendo que 1 es fácil, 2 intermedio, 3 difícil
          valorNivel += row.Cantidad * 0;
        } else if (row.ID_Dificultad === 2) {
          valorNivel += row.Cantidad * 0.5;
        } else if (row.ID_Dificultad === 3) {
          valorNivel += row.Cantidad * 1;
        }
      });
      valorNivel /= totalEjercicios;
  
      // Asignar ID_Dificultad basado en valorNivel
      let ID_Dificultad;
      let ID_NivelFormaFisica;
      if (valorNivel < 0.33) {
        ID_Dificultad = 1; // Fácil
        ID_NivelFormaFisica = 3;
      } else if (valorNivel < 0.66) {
        ID_Dificultad = 2; // Intermedio
        ID_NivelFormaFisica = 2;
      } else {
        ID_Dificultad = 3; // Difícil
        ID_NivelFormaFisica = 1;
      }
  
      console.log("Nivel: ", valorNivel);
      console.log("ID_Dificultad: ", ID_Dificultad);
  
      await pool
        .request()
        .input("ID_Rutina", sql.Int, rutinaId)
        .input("ID_Dificultad", sql.Int, ID_Dificultad)
        .input("ID_NivelFormaFisica", sql.Int, ID_NivelFormaFisica)
        .query(
          "UPDATE Rutina SET ID_Dificultad = @ID_Dificultad, ID_NivelFormaFisica = @ID_NivelFormaFisica WHERE ID_Rutina = @ID_Rutina"
        );
      const fechaAsignacion = new Date().toISOString();
  
      await pool
        .request()
        .input("fecha_asignacion", sql.DateTime, fechaAsignacion)
        .input("fecha_eliminacion", sql.DateTime, null)
        .input("fecha_inicio", sql.DateTime, fechaInicio)
        .input("fecha_fin", sql.DateTime, fechaFin)
        .input("ID_Rutina", sql.Int, rutinaId)
        .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil)
        .input("ID_Usuario_WEB", sql.VarChar, ID_Usuario_WEB)
        .query(querys.createAsignarRutinas);
  
      res.status(201).json({
        message: "Rutina creada y asignada correctamente para el cliente.",
      });
    } catch (error) {
      console.error("Error en la creación y asignación de la rutina para el cliente:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getAssignedRoutines = async (req, res) => {
    const ID_Usuario  = req.params.id; // Asume que obtienes el ID del usuario desde los parámetros del request

    try {
        const pool = await getConnection();
        const mobileUserResult = await pool
        .request()
        .input("ID_Usuario", sql.VarChar, ID_Usuario)
        .query("SELECT ID_UsuarioMovil FROM UsuarioMovil WHERE ID_Usuario = @ID_Usuario");
    
        const ID_UsuarioMovil = mobileUserResult.recordset[0].ID_UsuarioMovil;
    
        const result = await pool.request()
            .input("ID_UsuarioMovil", sql.VarChar, ID_UsuarioMovil) 
            .query(`
                SELECT 
                    R.ID_Rutina, 
                    RA.ID_Rutina_Asignada, 
                    R.nombre AS NombreRutina, 
                    CONVERT(char(10), RA.fecha_inicio, 126) as fecha_inicio,
                    CONVERT(char(10), RA.fecha_fin, 126) as fecha_fin
                FROM 
                    Rutina_Asignada RA
                INNER JOIN 
                    Rutina R ON RA.ID_Rutina = R.ID_Rutina
                INNER JOIN 
                    UsuarioMovil UM ON RA.ID_UsuarioMovil = UM.ID_UsuarioMovil
                WHERE 
                    UM.ID_UsuarioMovil = @ID_UsuarioMovil;
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener las rutinas asignadas:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
