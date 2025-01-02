// src/components/ListRequests/ListRequests.js

import React, { useEffect, useState } from 'react';
import { Table, Container, Spinner, Button, Alert, Modal } from 'react-bootstrap';
import Parse from '../../config/parseConfig';
import styles from './ListRequests.module.css';
import { useNavigate } from 'react-router-dom';

const ListRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null); // ID da solicitação sendo deletada
  const [showConfirm, setShowConfirm] = useState(false); // Controle para modal de confirmação
  const [selectedRequest, setSelectedRequest] = useState(null); // Solicitação selecionada para deletar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const query = new Parse.Query('CaseRequest');
        const results = await query.find();
        setRequests(results);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Falha ao buscar as solicitações. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleEdit = (requestId) => {
    navigate(`/app/create-request/${requestId}`); // Navega para a página de edição
  };

  const handleDelete = (request) => {
    setSelectedRequest(request);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    const requestId = selectedRequest.id;
    setDeletingId(requestId);
    setError('');
    setSuccess('');

    try {
      const query = new Parse.Query('CaseRequest');
      const caseRequest = await query.get(requestId);
      await caseRequest.destroy();

      // Atualizar o estado local removendo a solicitação deletada
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSuccess('Solicitação excluída com sucesso.');
    } catch (err) {
      console.error('Error deleting request:', err);
      setError('Falha ao excluir a solicitação. Por favor, tente novamente.');
    } finally {
      setDeletingId(null);
      setShowConfirm(false);
      setSelectedRequest(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedRequest(null);
  };

  return (
    <Container className={styles.listRequestsContainer}>
      <h1 className={`text-center ${styles.title}`}>Lista de Solicitações</h1>

      {/* Alertas de erro ou sucesso */}
      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}

      {/* Indicador de carregamento */}
      {loading ? (
        <div className={`text-center ${styles.loading}`}>
          <Spinner animation="border" role="status" className={styles.spinner}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Carregando solicitações...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className={styles.tableWrapper}>
          <Table
            striped
            bordered
            hover
            responsive
            size="sm"
            className={styles.table}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Credor</th>
                <th>Tipo</th>
                <th>Cidade</th>
                <th>Telefone</th>
                <th>Saldo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id.slice(-6)}</td>
                  <td>{request.get('requesterEmail') || '-'}</td>
                  <td>{request.get('creditorName') || '-'}</td>
                  <td>{request.get('requestType') || '-'}</td>
                  <td>{request.get('city') || '-'}</td>
                  <td>{request.get('phoneNumber') || '-'}</td>
                  <td>{`R$${parseFloat(request.get('lienBalance') || 0).toFixed(2)}`}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className={`${styles.editButton} me-2`}
                      onClick={() => handleEdit(request.id)}
                      disabled={deletingId === request.id}
                    >
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(request)}
                      disabled={deletingId === request.id}
                    >
                      {deletingId === request.id ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        '🗑️ Delete'
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className={`text-center ${styles.noData}`}>Nenhuma solicitação encontrada.</p>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal show={showConfirm} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <p>
              Tem certeza de que deseja excluir a solicitação de{' '}
              <strong>{selectedRequest.get('requesterEmail')}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deletingId === selectedRequest?.id}
          >
            {deletingId === selectedRequest?.id ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListRequests;
