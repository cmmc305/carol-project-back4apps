import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Alert, Spinner } from 'react-bootstrap';

const DocumentAnalysis = () => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        // 🔗 URL corrigida com o nome correto da aba
        const response = await fetch('https://opensheet.elk.sh/1wpnDIkr7A_RpM8sulHh2OcifbJD7zXol19dlmeJDmug/1');
        if (!response.ok) {
          throw new Error(`Erro ao buscar padrões: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("📊 Dados brutos da planilha:", data);

        // 🚀 Extraindo apenas os padrões de "Codes"
        const extractedPatterns = data
          .map(item => item.Codes ? item.Codes.split(', ') : []) // Separa os padrões por vírgula
          .flat(); // Achata os arrays para um único array

        console.log("✅ Padrões extraídos:", extractedPatterns);
        setPatterns(extractedPatterns);
      } catch (err) {
        console.error("🚨 Erro ao buscar padrões:", err);
        setError("Falha ao carregar padrões da planilha.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatterns();
  }, []);

  return (
    <Container>
      <h2>Padrões de Busca</h2>
      
      {loading && <Spinner animation="border" />}
      
      {error && <Alert variant="danger">{error}</Alert>}

      {patterns.length > 0 ? (
        <ListGroup>
          {patterns.map((pattern, index) => (
            <ListGroup.Item key={index}>{pattern}</ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="warning">Nenhum padrão carregado. Verifique a planilha.</Alert>
      )}
    </Container>
  );
};

export default DocumentAnalysis;
