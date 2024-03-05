import React, { useState, useEffect } from 'react';
import { APPOINTMENTS } from "../DATA_APPOINTMENTS";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import config from "../../utils/conf";
import NewAppointments from './NewAppointment';



export default function CurrentAppointments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setselectedAppointment] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showAddPage, setShowAddPage] = useState(false);
  const [cancelAppointment, setCancelAppointment] = useState(false);



  const filteredAppointments = APPOINTMENTS.filter(appointment =>
    appointment.assignedTo.toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
    (appointment.status === 'Pendiente' || appointment.status === 'Aceptada')
); 


    const handleRowClick = (appointment) => {
      if (expandedRow === appointment.id) {
        setExpandedRow(null);
        setselectedAppointment(null);
        setCancelAppointment(null);

      } else {
        if (cancelAppointment && cancelAppointment.id === appointment.id) {
          setCancelAppointment(null); 
        }
        setCancelAppointment(null);
        setExpandedRow(appointment.id);
        setselectedAppointment(appointment);
      }
    };

    const handleCancelClick = (appointment) => {
      if (cancelAppointment && cancelAppointment.id === appointment.id) {
        setExpandedRow(null);
        setselectedAppointment(null);
        setCancelAppointment(null);
      } else {
        if (expandedRow && expandedRow !== appointment.id) {
          setExpandedRow(null); 
          setselectedAppointment(null);
        }
        setExpandedRow(null);
        setselectedAppointment(null);
        setCancelAppointment(appointment); 
      }
    };
    
    const handleAddClick = () => {
      setShowAddPage(true); 
    };

    const handleBackToList = () => {
        setShowAddPage(false); 
    };

    const handleCancelAppointment = () => {

    }
    

    if (showAddPage) {
      return <NewAppointments onBackToList={handleBackToList} />;
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
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className={`row ${((selectedAppointment && selectedAppointment.id === appointment.id) || (cancelAppointment && cancelAppointment.id === appointment.id) ) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(appointment)} className={`row_header ${((selectedAppointment && selectedAppointment.id === appointment.id) || (cancelAppointment && cancelAppointment.id === appointment.id)) ? 'selected' : ''}`}>
                  <div>
                    <div className='row_name'>Cliente: {appointment.assignedTo}</div>
                    <div className='row_description'>{appointment.status} para el {appointment.date}</div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-trash card-icon ${cancelAppointment && cancelAppointment.id === appointment.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleCancelClick(appointment); }}></i>
                    </div>
                </div>
                {expandedRow === appointment.id && (
                  <>
                    <div className="exercise-info">
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">
                        Fecha de la cita: {appointment.date}
                      </div>
                      <div className="exercise-info-row">
                        Inicio de la cita: {appointment.startsAt}
                      </div>
                      <div className="exercise-info-row">
                        Fin de la cita: {appointment.endsAt}
                      </div>
                      </div>
                      <div className="exercise-info-column">
                      <div className="exercise-info-row">
                        <a href={appointment.place} target="_blank"> Lugar de la cita</a>
                      </div>
                      <div className="exercise-info-row">
                        Detalles extra: {appointment.details}
                      </div>
                      </div>
                    </div>
                  </>
                )}
                {cancelAppointment && cancelAppointment.id === appointment.id && (
                  <div className="exercise-info">
                  <button onClick={handleCancelAppointment} className="delete_button">
                    Cancelar cita
                  </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
