import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';

const CaseRequestForm = () => {
  const [einList, setEinList] = useState(['']);
  const [ssnList, setSsnList] = useState(['']);
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [formData, setFormData] = useState({
    requesterType: '',
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
  });

  const addEin = () => setEinList([...einList, '']);
  const addSsn = () => setSsnList([...ssnList, '']);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEinChange = (index, value) => {
    const updatedList = [...einList];
    updatedList[index] = value;
    setEinList(updatedList);
  };

  const handleSsnChange = (index, value) => {
    const updatedList = [...ssnList];
    updatedList[index] = value;
    setSsnList(updatedList);
  };

  const handleSubmit = () => {
    console.log('Submitted Data:', { ...formData, einList, ssnList, uccFiles, transactionProofFiles });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Case Request Form</Text>

      <Text style={styles.label}>Requester Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter requester type"
        value={formData.requesterType}
        onChangeText={(value) => handleInputChange('requesterType', value)}
      />

      <Text style={styles.label}>Requester Email</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={formData.requesterEmail}
        onChangeText={(value) => handleInputChange('requesterEmail', value)}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Creditor Name or Legal Representative</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter creditor name"
        value={formData.creditorName}
        onChangeText={(value) => handleInputChange('creditorName', value)}
      />

      <Text style={styles.label}>Business Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter business name"
        value={formData.businessName}
        onChangeText={(value) => handleInputChange('businessName', value)}
      />

      <Text style={styles.label}>Doing Business As</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter trade name"
        value={formData.doingBusinessAs}
        onChangeText={(value) => handleInputChange('doingBusinessAs', value)}
      />

      <Text style={styles.label}>Request Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter request type"
        value={formData.requestType}
        onChangeText={(value) => handleInputChange('requestType', value)}
      />

      <Text style={styles.label}>Lien Balance Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        value={formData.lienBalance}
        onChangeText={(value) => handleInputChange('lienBalance', value)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>EIN</Text>
      {einList.map((ein, index) => (
        <TextInput
          key={`ein-${index}`}
          style={styles.input}
          placeholder="Enter EIN"
          value={ein}
          keyboardType="numeric"
          onChangeText={(value) => handleEinChange(index, value)}
        />
      ))}
      <Button title="Add Another EIN" onPress={addEin} />

      <Text style={styles.label}>SSN</Text>
      {ssnList.map((ssn, index) => (
        <TextInput
          key={`ssn-${index}`}
          style={styles.input}
          placeholder="Enter SSN"
          value={ssn}
          keyboardType="numeric"
          onChangeText={(value) => handleSsnChange(index, value)}
        />
      ))}
      <Button title="Add Another SSN" onPress={addSsn} />

      <Text style={styles.label}>UCC Notice Files</Text>
      <TouchableOpacity style={styles.fileUploadButton}>
        <Text style={styles.fileUploadText}>Upload Files</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Proof of Transaction</Text>
      <TouchableOpacity style={styles.fileUploadButton}>
        <Text style={styles.fileUploadText}>Upload Proof</Text>
      </TouchableOpacity>

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  fileUploadButton: {
    backgroundColor: '#5469d4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  fileUploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CaseRequestForm;
