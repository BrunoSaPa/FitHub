import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const AddRoutineScreen = ({ navigation }) => {
  const [oid, setOid] = useState("");
  const [error, setError] = useState("");
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false);

  useEffect(() => {
    // Obtener el oid desde AsyncStorage
    AsyncStorage.getItem("userOID")
      .then((value) => {
        if (value !== null) {
          setOid(value);
          console.log("OID obtenido:", value);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el OID:", error);
      });
  }, []);

  console.log("OID:", oid);

  const [routineName, setRoutineName] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const daysOptions = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const addDay = () => {
    if (workouts.length >= 7) {
      setIsMaxDaysReached(true);
      setError("No puedes agregar más de 7 días.");
      return;
    }

    setIsMaxDaysReached(false); // Resetear el indicador si previamente se alcanzó el límite y ahora se está dentro del límite permitido
    setError(""); // Limpiar errores previos

    setWorkouts([
      ...workouts,
      {
        id: `Día ${workouts.length + 1}`,
        muscles: "",
        duration: "",
        ID_Dia: null, // Este valor se actualizará con el índice del día seleccionado
      },
    ]);
  };

  const deleteDay = (index) => {
    const newWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(newWorkouts);

    // Revisar si el número de días después de eliminar uno es menor que 7 y actualizar isMaxDaysReached
    if (newWorkouts.length < 7) {
      setIsMaxDaysReached(false);
      setError(""); // Opcionalmente, limpiar cualquier mensaje de error relacionado con el límite de días
    }
  };

  const onSelectDay = (index, optionIndex) => {
    // Actualiza el día basado en la selección del usuario
    const updatedWorkouts = workouts.map((workout, i) => {
      if (i === index) {
        return { ...workout, ID_Dia: optionIndex + 1 }; // Asumiendo que los IDs de los días van de 1 a 7
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const saveRoutine = async () => {
    // Primero, verificar que todos los días de entrenamiento tengan un ID_Dia asignado
    const todosTienenDia = workouts.every((workout) => workout.ID_Dia !== null);
    const idsUnicos = new Set(workouts.map((workout) => workout.ID_Dia));

    if (!todosTienenDia) {
      setError("Todos los días de entrenamiento deben tener un día asignado.");
      return;
    }

    if (idsUnicos.size !== workouts.length) {
      setError("Los días de entrenamiento deben ser diferentes entre sí.");
      return;
    }

    setError(""); // Limpiar errores si todo está correcto hasta ahora

    try {
      // Asumiendo que ya has obtenido el oid de AsyncStorage y los demás estados están definidos
      const oid = await AsyncStorage.getItem("userOID");
      const workoutsIds = workouts.map((workout) => workout.ID_Dia); // Ya tienes esto listo

      // Preparar el cuerpo de la solicitud
      const requestBody = {
        oid: oid,
        routineName: routineName,
        workoutsIds: workoutsIds,
      };

      console.log(requestBody);

      setTimeout(async () => {
        const response = await fetch(`${config.apiBaseUrl}/rutinas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          console.log("Rutina enviada exitosamente a la base de datos");
          navigation.navigate("Rutinas", { rutinaCreada: true });
          // Navegar a otra pantalla o mostrar algún mensaje de éxito aquí
        } else {
          console.log("Error al enviar la rutina a la base de datos");
          // Manejar el error adecuadamente aquí
        }
      }, 2000); // Puedes ajustar este retraso según lo necesites
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
      // Manejar el error adecuadamente aquí
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nombre de la rutina</Text>
        <TouchableOpacity onPress={saveRoutine}>
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
      />
      <ScrollView style={styles.workoutsList}>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutItem}>
            <TouchableOpacity onPress={() => deleteDay(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutDay}> {workout.id}</Text>
              <ModalDropdown
                options={daysOptions}
                onSelect={(optionIndex) => onSelectDay(index, optionIndex)}
                defaultValue="Selecciona un día"
                textStyle={styles.dropdownText}
                dropdownTextStyle={styles.dropdownTextStyle}
                dropdownStyle={styles.dropdownStyle}
              />
              {/* Por ahora los campos de músculos y tiempo quedan vacíos */}
            </View>
          </View>
        ))}
      </ScrollView>
      <Text style={{ color: "red", margin: 10 }}>{error}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={addDay}
        disabled={isMaxDaysReached} // Deshabilitar el botón si se alcanzó el máximo de días
      >
        <Text style={styles.addButtonText}>Añadir día</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workoutDay: {
    fontWeight: "bold",
  },
  addButton: {
    margin: 16,
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  dropdownStyle: {
    marginTop: 15,
    marginLeft: -10,
    width: 150,
  },
  // Estilos adicionales para el ícono de borrar, texto y dropdown pueden ir aquí
});
export default AddRoutineScreen;
