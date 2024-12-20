import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const CaseRequestForm = () => {
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

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (setter) => {
    try {
      const result = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      setter((prevFiles) => [...prevFiles, ...result]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('File selection canceled');
      } else {
        console.error('Error selecting file:', err);
      }
    }
  };

  const handleSubmit = () => {
    console.log('Submitted Data:', {
      ...formData,
      uccFiles,
      transactionProofFiles,
    });
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

        {/* Outros campos aqui */}

        <Text style={styles.label}>UCC Notice Files</Text>
        <TouchableOpacity
          style={styles.fileUploadButton}
          onPress={() => handleFileUpload(setUccFiles)}
        >
          <Text style={styles.fileUploadText}>Upload Files</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Proof of Transaction</Text>
        <TouchableOpacity
          style={styles.fileUploadButton}
          onPress={() => handleFileUpload(setTransactionProofFiles)}
        >
          <Text style={styles.fileUploadText}>Upload Proof</Text>
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
