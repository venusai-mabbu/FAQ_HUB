import React, { useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { useAuth } from '../context/useAuth';
import './AddFAQ.css';

const AddFAQ = () => {
  const { auth, updateSections } = useAuth();
  const { token, sections } = auth;

  const [formData, setFormData] = useState({
    section: '',
    question: '',
    answer: ''
  });

  const sectionOptions = sections.map(sec => ({
    value: sec,
    label: sec
  }));

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSectionChange = (selectedOption) => {
    setFormData({ ...formData, section: selectedOption?.value || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { section, question, answer } = formData;
    if (!section || !question || !answer) return;

    try {
      const res = await axios.post(
        'http://localhost:3000/posts/',
        { section, question, answer },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      console.log('FAQ added:', res.data);
      updateSections(section);
      setFormData({ section: '', question: '', answer: '' });
    } catch (err) {
      console.error('Failed to submit FAQ:', err.response?.data || err.message);
    }
  };

  return (
    <main className="faq-container">
      <h1 className="faq-title">Add a New FAQ</h1>

      <form onSubmit={handleSubmit} className="faq-form">
        <label>
          Section *
          <CreatableSelect
            options={sectionOptions}
            onChange={handleSectionChange}
            value={formData.section ? { value: formData.section, label: formData.section } : null}
            placeholder="Select or type a new section"
            isClearable
            className="select-input"
          />
        </label>

        <label>
          Question *
          <textarea
            rows={3}
            value={formData.question}
            onChange={handleChange('question')}
            placeholder="Type your question here..."
            required
          />
        </label>

        <label>
          Answer *
          <textarea
            rows={5}
            value={formData.answer}
            onChange={handleChange('answer')}
            placeholder="Type the answer here..."
            required
          />
        </label>

        <button type="submit" className="submit-btn">Submit FAQ</button>
      </form>

      <footer className="faq-footer">
        © 2025 FAQ Hub. All rights reserved.
      </footer>
    </main>
  );
};

export default AddFAQ;
