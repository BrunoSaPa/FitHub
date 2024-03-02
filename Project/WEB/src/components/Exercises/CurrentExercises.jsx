import React, { useState, useEffect} from 'react';
import { ExerciseCard } from "../DATA_EXERCISES";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import NewExercises from './NewExercises';
import config from "../../utils/conf";

export default function CurrentExercises() {
    const [exercises, setExercises] = useState([]); // Cambiado para almacenar los ejercicios desde el backend
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [showAddPage, setShowAddPage] = useState(false);
    
    useEffect(() => {
      // Función para cargar los ejercicios desde el backend
      const loadExercises = async () => {
          try {
              const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
              if (!response.ok) {
                  throw new Error('No se pudieron obtener los ejercicios');
              }
              const data = await response.json();
              console.log(data);
              setExercises(data); // Almacena los ejercicios en el estado
          } catch (error) {
              console.error("Error al obtener los ejercicios:", error);
          }
      };

      loadExercises();
  }, []); 
  
  const filteredExercises = exercises.filter(exercise =>
    exercise.ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
);

  
    const handleRowClick = (exercise) => {
      if (expandedRow === exercise.ID_Ejercicio) {
        setExpandedRow(null);
        setSelectedExercise(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        setExpandedRow(exercise.ID_Ejercicio);
        setSelectedExercise(exercise); // Selecciona la fila al hacer clic
      }
    };

    const handleAddClick = () => {
      setShowAddPage(true); // Actualiza el estado para mostrar el nuevo componente al hacer clic en el icono de agregar
    };

    const handleBackToList = () => {
        setShowAddPage(false); // Volver a la lista de ejercicios
    };
    
    // Si showAddPage es verdadero, renderiza el componente de agregar ejercicio
    if (showAddPage) {
        return <NewExercises onBackToList={handleBackToList} />;
    }

    return (
      <div className="container">
          <div className="search-bar-container">
            <div className='search-bar'>
              <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <div>
              <a className="iconadd" role="button" onClick={handleAddClick}><i className="bi bi-plus-circle-fill"></i></a>
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredExercises.map((exercise) => (
              <li key={exercise.id} className={`row ${((selectedExercise && selectedExercise.id === exercise.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(exercise)} className={`row_header ${((selectedExercise && selectedExercise.id === exercise.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>{exercise.ejercicio}</div>
                    <div className='row_description'>{exercise.Musculo}</div>
                  </div>
                </div>
                {expandedRow === exercise.ID_Ejercicio && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">Dificultad: {exercise.Dificultad}</div>
                        <div className="exercise-info-row">Equipo Necesario: {exercise.Equipo}</div>
                        <div className="exercise-info-row">Tipo de ejercicio: {exercise.Tipo_Ejercicio}</div>
                        <div className="exercise-info-row">Modalidad: {exercise.Modalidad}</div>
                        <div className='row_description'>
                        Músculos Secundarios: 
                        {exercise.musculosSecundarios.map(ms => ms.descripcion).join(", ")}
                        </div>    
                      </div>
                      <div className="exercise-info-column">
                        <div className="exercise-info-row">Posición inicial: {exercise.preparacion}</div>
                        <div className="exercise-info-row">Ejecucion: {exercise.ejecucion}</div>
                        </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}