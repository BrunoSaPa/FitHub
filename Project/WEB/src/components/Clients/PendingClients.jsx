import React, {useState } from 'react';
import { UserCard } from "../DATA_USER_CARD";
import SearchBar from '../SearchBar';
import '../../styles/Management.css';
import Chat from '../Chat';
import { deleteDoc, collection, getFirestore, query, where, getDocs } from "firebase/firestore";
import { useMsal } from "@azure/msal-react";


export default function PendingClients() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [eliminatingClient, setEliminatingClient] = useState(null);

    const { instance } = useMsal();
    const activeAccount = instance.getActiveAccount();

    const sender = activeAccount.idTokenClaims.oid; // OID del usuario actual
    
    const filteredUsers = UserCard.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleRowClick = (user) => {
      if (expandedRow === user.id) {
        setExpandedRow(null);
        setEliminatingClient(null);
        setSelectedUser(null); // Deselecciona la fila al hacer clic nuevamente
      } else {
        if (eliminatingClient && eliminatingClient.id === user.id) {
          setEliminatingClient(null);
          setEliminatingClient(null);
        }
        setEliminatingClient(null);
        setExpandedRow(user.id);
        setSelectedUser(user); // Selecciona la fila al hacer clic
      }
    };


    const handleDeleteClick = (user) => {
      if (eliminatingClient && eliminatingClient.id === user.id) {
        setEliminatingClient(null); // Si el mismo ejercicio está seleccionado, oculta el formulario de edición
      } else {
        if (expandedRow && expandedRow !== user.id) {
          setExpandedRow(null); // Si hay una fila expandida diferente a la seleccionada, ciérrala
          setSelectedUser(null);
          setEliminatingClient(null);
        }
        setExpandedRow(null);
        setSelectedUser(null);
        setEliminatingClient(user); 
      }
    };

    const deleteConversation = async (sender, eliminatingClientId) => {
      const db = getFirestore();
      const conversationsRef = collection(db, "conversaciones");
    
      try {
        // Consulta para buscar las conversaciones que contienen al sender
        const querySender = query(conversationsRef, where("participantes", "array-contains", sender));
        const senderSnapshot = await getDocs(querySender);
    
        // Consulta para buscar las conversaciones que contienen al eliminatingClient
        const queryEliminatingClient = query(conversationsRef, where("participantes", "array-contains", eliminatingClientId));
        const eliminatingClientSnapshot = await getDocs(queryEliminatingClient);
    
        // Obtiene las conversaciones que cumplen ambas condiciones
        const conversationsToDelete = [];
        senderSnapshot.forEach((doc) => {
          if (eliminatingClientSnapshot.docs.some(eliminatingClientDoc => eliminatingClientDoc.id === doc.id)) {
            conversationsToDelete.push(doc.ref);
          }
        });
    
        // Elimina las conversaciones encontradas
        conversationsToDelete.forEach(async (conversationRef) => {
          await deleteDoc(conversationRef);
          console.log("Conversación eliminada:", conversationRef.id);
        });
    
      } catch (error) {
        console.error("Error al eliminar la conversación:", error);
      }
    };
    
    
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      if (eliminatingClient && eliminatingClient.id) {
        try {
          // Elimina la conversación entre el sender y el cliente seleccionado
          await deleteConversation(sender, eliminatingClient.id);
        } catch (error) {
          console.error("Error al eliminar la conversación:", error);
        }
      } else {
        console.error("No se seleccionó un cliente válido para eliminar la conversación.");
      }
    
    };

    return (
      <div className="container2">
          <div className="search-bar-container2">
            <div className='search-bar'>
            <div className='addclient'><i className="bi bi-search h4"></i></div>
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          </div>
          <ul className='cardcontainer'>
            {filteredUsers.map((user) => (
              <li key={user.id} className={`row ${((selectedUser && selectedUser.id === user.id) || (eliminatingClient && eliminatingClient.id === user.id)) ? 'selected' : ''}`}>
                <div onClick={() => handleRowClick(user)} className={`row_header ${((selectedUser && selectedUser.id === user.id) || (eliminatingClient && eliminatingClient.id === user.id)) ? 'selected' : ''}`}>
                  <div className='UserCard'>
                  { user.gender === "Mujer" && (
                    <div  className='icon'><i class="bi bi-person-standing-dress"></i></div>
                  )}
                  {user.gender === "Hombre" &&(
                    <div  className='icon'><i class="bi bi-person-standing"></i></div>
                  )}
                  <div>
                    <div className='row_name'>{user.name}</div>
                    <div className='row_description'>{user.role.join(" - ")}</div>
                  </div>
                  </div>
                  <div className="row_edit">
                      <i className={`bi bi-trash card-icon ${eliminatingClient && eliminatingClient.id === user.id ? 'selected' : ''}`} onClick={(e) => { e.stopPropagation(); handleDeleteClick(user); }}></i>
                    </div>
                </div>
                {expandedRow === user.id && (
                  <>
                    <>
                      <Chat reciever={user.id}/>
                    </>
                  </>
                )}
                {eliminatingClient && eliminatingClient.id === user.id && (
                  <>
                  <div className="exercise-info">
                  <form className='form_add_exercise' onSubmit={handleSubmit}>
                    <button type="submit" className='delete_button'>Eliminar cliente pendiente</button>
                  </form>
                  </div>
                  </>
                )}
              </li>
            ))}
          </ul>
      </div>
    );
}
