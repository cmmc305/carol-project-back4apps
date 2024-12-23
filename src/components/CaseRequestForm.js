import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Parse from './parseConfig';

const CaseRequestForm = () => {
  const [uccFiles, setUccFiles] = useState([]);
  const [transactionProofFiles, setTransactionProofFiles] = useState([]);
  const [einList, setEinList] = useState(['']);
  const [ssnList, setSsnList] = useState(['']);
  const [formData, setFormData] = useState({
    requesterType: '',
    requesterEmail: '',
    creditorName: '',
    businessName: '',
    doingBusinessAs: '',
    requestType: '',
    lienBalance: '',
  });

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

  const addEin = () => setEinList([...einList, '']);
  const addSsn = () => setSsnList([...ssnList, '']);

  const saveDataToBack4App = async () => {
    const CaseRequest = new Parse.Object('CaseRequest');
    CaseRequest.set('requesterType', formData.requesterType);
    CaseRequest.set('requesterEmail', formData.requesterEmail);
    CaseRequest.set('creditorName', formData.creditorName);
    CaseRequest.set('businessName', formData.businessName);
    CaseRequest.set('doingBusinessAs', formData.doingBusinessAs);
    CaseRequest.set('requestType', formData.requestType);
    CaseRequest.set('lienBalance', parseFloat(formData.lienBalance));
    CaseRequest.set('uccFiles', uccFiles.map((file) => ({ name: file.name, type: file.type, size: file.size })));
    CaseRequest.set('transactionProofFiles', transactionProofFiles.map((file) => ({ name: file.name, type: file.type, size: file.size })));
    CaseRequest.set('einList', einList); // Armazena EIN como array
    CaseRequest.set('ssnList', ssnList); // Armazena SSN como array

    try {
      await CaseRequest.save();
      Alert.alert('Success', 'Data saved successfully!');
      setFormData({
        requesterType: '',
        requesterEmail: '',
        creditorName: '',
        businessName: '',
        doingBusinessAs: '',
        requestType: '',
        lienBalance: '',
      });
      setEinList(['']);
      setSsnList(['']);
      setUccFiles([]);
      setTransactionProofFiles([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data. Please try again.');
      console.error('Error saving data:', error);
    }
  };

  const handleSubmit = () => {
    saveDataToBack4App();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
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

        <Text style={styles.label}>EIN</Text>
        {einList.map((ein, index) => (
          <TextInput
            key={`ein-${index}`}
            style={styles.input}
            placeholder="Enter EIN"
            value={ein}
            onChangeText={(value) => handleEinChange(index, value)}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addEin}>
          <Text style={styles.addButtonText}>+ Add EIN</Text>
        </TouchableOpacity>

        <Text style={styles.label}>SSN</Text>
        {ssnList.map((ssn, index) => (
          <TextInput
            key={`ssn-${index}`}
            style={styles.input}
            placeholder="Enter SSN"
            value={ssn}
            onChangeText={(value) => handleSsnChange(index, value)}
          />
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addSsn}>
          <Text style={styles.addButtonText}>+ Add SSN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f5',
  },
  form: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CaseRequestForm;
