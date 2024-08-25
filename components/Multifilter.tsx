"use client"
import React, { useState } from 'react';
import axios from 'axios';

// Define TypeScript interface for backend response
interface FilterResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
}

const MultifilterComponent: React.FC = () => {
  const [filterOption, setFilterOption] = useState<string>('alphabets');
  const [inputArray, setInputArray] = useState<string>('["M","1","334","4","B","Z","d"]');
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilterOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputArray(e.target.value);
  };

  const parseInputArray = async () => {
    try {
      const array = JSON.parse(inputArray);

      const response = await axios.post<FilterResponse>('https://bajaj-task-backend-3.onrender.com/data', {
        data: array,
        filter: filterOption
      });

      if (response.data.is_success) {
        setResults(response.data);
        setError(null);
      } else {
        setResults(null);
        setError('Filtering failed.');
      }
    } catch (error) {
      console.error('Error filtering data:', error);
      setResults(null);
      setError('Error processing request.');
    }
  };

  const getFilteredData = () => {
    if (!results) return [];

    switch (filterOption) {
      case 'numbers':
        return results.numbers;
      case 'alphabets':
        return results.alphabets;
      case 'highest_lowercase_alphabet':
        return results.highest_lowercase_alphabet;
      default:
        return [];
    }
  };

  return (
    <div>
      <h1>Multifilter Component</h1>
      <div>
        <label>
          Filter Option:
          <select value={filterOption} onChange={handleFilterOptionChange}>
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Input Array (JSON format):
          <input
            type="text"
            value={inputArray}
            onChange={handleInputChange}
            placeholder='e.g., ["M","1","334","4","B","Z","d"]'
          />
        </label>
      </div>
      <button onClick={parseInputArray}>Filter</button>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {results && (
          <div>
            <h2>Results:</h2>
            <p><strong>User ID:</strong> {results.user_id}</p>
            <p><strong>Email:</strong> {results.email}</p>
            <p><strong>Roll Number:</strong> {results.roll_number}</p>
            <h3>Filtered Data:</h3>
            <pre>{JSON.stringify(getFilteredData(), null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultifilterComponent;
