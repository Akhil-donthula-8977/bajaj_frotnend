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
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Multifilter Component</h1>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter Option:
          <select
            value={filterOption}
            onChange={handleFilterOptionChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
          </select>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Array (JSON format):
          <input
            type="text"
            value={inputArray}
            onChange={handleInputChange}
            placeholder='e.g., ["M","1","334","4","B","Z","d"]'
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </label>
      </div>
      
      <button
        onClick={parseInputArray}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Filter
      </button>
      
      <div className="mt-6">
        {error && <p className="text-red-500">{error}</p>}
        {results && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Results:</h2>
            <p><strong>User ID:</strong> {results.user_id}</p>
            <p><strong>Email:</strong> {results.email}</p>
            <p><strong>Roll Number:</strong> {results.roll_number}</p>
            <h3 className="text-lg font-medium text-gray-700 mt-4">Filtered Data:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(getFilteredData(), null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultifilterComponent;
