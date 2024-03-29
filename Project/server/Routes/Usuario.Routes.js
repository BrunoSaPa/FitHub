import { Router } from "express";
import {
    getUsers,
    checkIfUserExists,
    createUser,
    getBirthDate,
    getUserAndType,
    getUserById, updateComparacionRendimiento,
    updateViajeGimnasio,
getAllMobileUsersInfo
} from "../Controllers/Usuario.Controller.js";

import { getMaterials } from "../Controllers/Materiales.Controllers.js";
import { createCuestionario } from "../Controllers/Cuestionario.Controllers.js";
import { createEjercicio, getExercises, getEjercicioById, updateEjercicio, getAlternativeExercises, requestEjercicio, getRequests, updateEstadoEjercicio, deleteEjercicio, updateRequest } from "../Controllers/EjerciciosControllers.js";
import { createAlimento, getAllAlimentosWithMacronutrientes, updateAlimento, createAlimentoRequest, getAllAlimentosWithMacronutrientesRequest, updateEstadoAlimento, deleteAlimento, updateAndAcceptAlimento} from "../Controllers/Alimento.Controllers.js";
import { createReceta, getReceta, updateReceta, getIngredientes, createRecetaRequest, getRecetaRequests, updateEstadoReceta, deleteReceta, updateAndAcceptReceta } from "../Controllers/Recetas.Controllers.js";
import { createRutina, getRutinasByUsuario, getRutinaByID, updateRutina, createEjerciciosDia, getEjerciciosPorDia, updateEjerciciosDia, crearBloqueSetsConSeries, actualizarBloqueSetsConSeries, obtenerSetsPorEjercicioDia, deleteRutina, createCompleteRutina, getCompleteRutinas } from "../Controllers/Rutinas.Controllers.js";
import { getTiemposComida, getAllAlimentosAndRecetas, createAndAssignDiet, getDietasByID, getCurrentOrUpcomingDiet, obtenerCompletadosPorFecha, registrarCompletado, eliminarCompletado } from "../Controllers/Dietas.Controllers.js";
import { createCompleteRutinaForClient, getAssignedRoutines } from "../Controllers/AsignarRutinas.Controllers.js";
import { createTrainerClientRequest, getPendingTrainerClientRequests, deleteTrainerClientRequest, getPendingClient, deleteTrainerClient, acceptClientRequest, getTrainerInfo, updateClientRating, getAllClientsOfTrainer, deleteClientFromTrainer, getAllTrainersInfo, createClientTrainerRequest, getPendingRequestsForTrainer, acceptClientTrainerRequest, deleteClientTrainerRequest, checkPendingRequest, checkRequest, insertTrainerNutritionistRequest, getApplicationDetails, acceptAndCreateTrainerNutritionist, deleteSolicitudById} from "../Controllers/Solicitudes.js";
import { createCita, getCitas, aceptarCita, cancelarCita, completarCita, pendienteCita, rechazarCita, getRejectedCitas, actualizarCita, getCitasMobile, getAceptadasCitas, getAcceptedCitasMobile, getAcceptedCitasMobileAndDate } from "../Controllers/Citas.Controllers.js"
import { getWorkoutSession, updateWorkoutSeries } from "../Controllers/Entrenamiento.Controllers.js";


//El que come callado repite

const router = Router();
//Usuarios
router.get("/users", getUsers);
router.get("/users/:oid", checkIfUserExists);
router.get("/birthdate/:oid", getBirthDate);
router.post("/users", createUser);
router.get("/usertype", getUserAndType);
router.get("/user/:oid", getUserById);
router.put('/Rendimiento/:id', updateComparacionRendimiento);
router.put('/ViajeGimnasio/:id', updateViajeGimnasio);
router.get("/mobileuser", getAllMobileUsersInfo);

//Solicitudes
router.post("/solicitud", createTrainerClientRequest);
router.post("/pendingclients", getPendingTrainerClientRequests);
router.post("/deleteolicitud", deleteTrainerClientRequest);
router.get("/pendingclient/:oid", getPendingClient);
router.delete("/deletesolicitud/:id", deleteTrainerClient);
router.post("/acceptclient", acceptClientRequest);
router.get("/trainerinfo/:oid", getTrainerInfo);
router.put("/updatecalificacion", updateClientRating);
router.get("/allclients/:oid", getAllClientsOfTrainer);
router.post("/deleteClientFromTrainer", deleteClientFromTrainer);
router.get("/alltrainers", getAllTrainersInfo);
router.post("/crearSolicitud", createClientTrainerRequest);
router.get("/pendingrequests/:trainerId", getPendingRequestsForTrainer);
router.post("/acceptclienttrainer", acceptClientTrainerRequest);
router.post("/deletesolicitudtrainer", deleteClientTrainerRequest);
router.post("/checkpendingrequest", checkPendingRequest);
router.post("/checkrequest", checkRequest);

//Solitudes Entrenador-Nutricionista
router.post("/insertTrainer", insertTrainerNutritionistRequest);
router.get("/applicationdetails", getApplicationDetails)
router.post("/acceptandcreatetrainer", acceptAndCreateTrainerNutritionist);
router.delete("/deletesolicitud1/:id", deleteSolicitudById);


//Materiales
router.get("/materials", getMaterials); 

//Cuestionario
router.post("/cues", createCuestionario);

//Ejercicios
router.post("/ejercicios", createEjercicio);
router.get("/ejercicio", getExercises);
router.get("/ejercicio/:id", getEjercicioById);
router.put("/ejercicio/:id", updateEjercicio);
router.get("/alternativas/:id", getAlternativeExercises);
router.post("/exerciserequest", requestEjercicio);
router.get("/exerciserequest", getRequests);
router.put("/estadoejercicio/:id", updateEstadoEjercicio);
router.delete("/ejercicio/:id", deleteEjercicio);
router.put("/ejerciciorequest/:id", updateRequest);

//Alimentos
router.post("/alimentos", createAlimento);
router.get("/alimentos", getAllAlimentosWithMacronutrientes);
router.put("/alimentos/:id", updateAlimento);
router.post("/alimentorequest", createAlimentoRequest);
router.get("/alimentorequest", getAllAlimentosWithMacronutrientesRequest);
router.put("/estadoalimento/:id", updateEstadoAlimento);
router.delete("/alimento/:id", deleteAlimento);
router.put("/alimento/:id", updateAndAcceptAlimento);

//Recetas
router.post("/recetas", createReceta);
router.get("/recetas", getReceta);
router.put("/recetas/:id", updateReceta);
router.get("/ingredientes/:id", getIngredientes);
router.post("/recetarequest", createRecetaRequest);
router.get("/recetarequest", getRecetaRequests);
router.put("/estadoreceta/:id", updateEstadoReceta);
router.delete("/receta/:id", deleteReceta);
router.put("/receta/:id", updateAndAcceptReceta);

//Rutinas
router.post("/rutinas", createRutina);
router.get("/rutinas/:oid", getRutinasByUsuario);
router.get("/rutina/:id", getRutinaByID);
router.put("/rutina/:id", updateRutina);
router.post("/rutinaejercicios", createEjerciciosDia);
router.get("/ejerciciosdia/:id", getEjerciciosPorDia);
router.put("/rutinaejercicios", updateEjerciciosDia);
router.post("/bloquesets", crearBloqueSetsConSeries);
router.put("/bloquesets", actualizarBloqueSetsConSeries);
router.get("/sets/:id", obtenerSetsPorEjercicioDia);
router.delete("/rutina/:id", deleteRutina);
router.post("/rutinacompleta", createCompleteRutina);
router.get("/rutinacompleta", getCompleteRutinas);

//Asignar rutinas
router.post("/rutinaasignar", createCompleteRutinaForClient);
router.get("/rutinasasignar/:id", getAssignedRoutines);

//Dietas
router.get("/tiemposComida", getTiemposComida);
router.get("/comidasRecetas", getAllAlimentosAndRecetas);
router.post("/dieta", createAndAssignDiet);
router.get("/dieta/:id", getDietasByID);
router.get("/dietaactual/:id/:selectedDate", getCurrentOrUpcomingDiet);
router.post("/registrocompletado", registrarCompletado);
router.get("/completados/:id/:fecha", obtenerCompletadosPorFecha);
router.delete("/eliminarCompletado", eliminarCompletado);

//Citas
router.post("/cita", createCita);
router.get("/cita/:id", getCitas);
router.put("/aceptarcita/:id", aceptarCita);
router.put("/pendientecita/:id", pendienteCita);
router.put("/rechazarcita/:id", rechazarCita);
router.put("/cancelarcita/:id", cancelarCita);
router.put("/completarcita/:id", completarCita);
router.get("/citasrechazadas/:id", getRejectedCitas);
router.put("/cita/:id", actualizarCita);
router.get("/citaspendientes/:id", getCitasMobile);
router.get("/citasaceptadas/:id", getAceptadasCitas);
router.get("/citasaceptada/:id", getAcceptedCitasMobile);
router.get("/citasaceptada2/:id/:selectedDate", getAcceptedCitasMobileAndDate);

//Entrenamiento
router.get("/entrenamiento/:id/:fecha", getWorkoutSession);
router.post("/entrenamiento", updateWorkoutSeries);

export default router;

