
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

const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
];

const MultifilterComponent: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [inputArray, setInputArray] = useState<string>('["M","1","334","4","B","Z","d","d"]');
  const [results, setResults] = useState<FilterResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (value: string) => {
    setSelectedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputArray(e.target.value);
  };

  const parseInputArray = async () => {
    try {
      const array = JSON.parse(inputArray);
      const filterOptions = Array.from(selectedOptions);

      const response = await axios.post<FilterResponse>('https://bajaj-task-backend-3.onrender.com/data', {
        data: array,
        filter: filterOptions
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
    if (!results) return {};

    const filteredData: { [key: string]: string[] } = {};
    if (selectedOptions.has('numbers')) filteredData['Numbers'] = results.numbers;
    if (selectedOptions.has('alphabets')) filteredData['Alphabets'] = results.alphabets;
    if (selectedOptions.has('highest_lowercase_alphabet')) filteredData['Highest Lowercase Alphabet'] = results.highest_lowercase_alphabet;
    
    return filteredData;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Multifilter Component - By Donthula Akhil (21BEC0445)</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter Options:
          <div className="mt-1 flex flex-wrap gap-2">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleOptionChange(option.value)}
                className={`px-4 py-2 rounded-md border border-gray-300 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedOptions.has(option.value)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Input Array (JSON format):
          <input
            type="text"
            value={inputArray}
            onChange={handleInputChange}
            placeholder='e.g., ["M","1","334","4","B","Z","d","d"]'
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
            <div className="bg-gray-100 p-4 rounded-md">
              {Object.entries(getFilteredData()).map(([heading, items]) => (
                <div key={heading} className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800">{heading}:</h4>
                  <ul className="list-disc list-inside pl-5">
                    {items.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultifilterComponent;
