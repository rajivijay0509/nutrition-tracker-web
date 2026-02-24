import React, { useState, useEffect } from 'react';
import { useWellnessStore } from '../store/wellnessStore';
import '../styles/Wellness.css';

const WellnessPage = () => {
  const { logWellness, logSymptom, getWellness, wellness } = useWellnessStore();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [moodEmoji, setMoodEmoji] = useState('neutral');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [sleepHours, setSleepHours] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [activityLevel, setActivityLevel] = useState('light');
  const [notes, setNotes] = useState('');

  // New health metrics
  const [weight, setWeight] = useState('');
  const [fastingGlucose, setFastingGlucose] = useState('');
  const [afterFoodGlucose, setAfterFoodGlucose] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [supplements, setSupplements] = useState([]);
  const [customSupplement, setCustomSupplement] = useState('');

  // Symptom tracking
  const [showSymptomForm, setShowSymptomForm] = useState(false);
  const [symptomType, setSymptomType] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState(3);
  const [symptomDescription, setSymptomDescription] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const moodOptions = [
    { emoji: 'Bad', label: 'Bad', value: 'bad' },
    { emoji: 'OK', label: 'OK', value: 'ok' },
    { emoji: 'Good', label: 'Good', value: 'good' },
    { emoji: 'Great', label: 'Great', value: 'great' },
    { emoji: 'Excellent', label: 'Excellent', value: 'excellent' },
  ];

  const commonSupplements = [
    'Multivitamin',
    'Vitamin D',
    'Vitamin C',
    'Vitamin B12',
    'Omega-3 Fish Oil',
    'Calcium',
    'Magnesium',
    'Iron',
    'Zinc',
    'Probiotics',
    'Biotin',
    'Folic Acid',
    'Turmeric/Curcumin',
    'Ashwagandha',
    'Melatonin',
    'CoQ10',
    'Collagen',
    'Green Tea Extract',
    'Glucosamine',
    'Protein Powder',
  ];

  const symptoms = [
    'Headache',
    'Nausea',
    'Dizziness',
    'Stomach Cramps',
    'Bloating',
    'Fatigue',
    'Joint Pain',
    'Skin Rash',
    'Itching',
    'Flushing',
    'Giddiness',
    'Hives',
    'Irritability',
    'Jitters',
    'Rapid Heartbeat',
    'Reflux',
    'Restlessness',
    'Skin Swelling',
    'Sleeplessness',
    'Stuffy Nose',
  ];

  const activityLevels = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Vigorous', value: 'vigorous' },
  ];

  // Load wellness data for selected date
  useEffect(() => {
    loadWellnessData();
  }, [selectedDate]);

  const loadWellnessData = async () => {
    try {
      const data = await getWellness(selectedDate);
      if (data) {
        setMoodEmoji(data.moodEmoji || 'neutral');
        setEnergyLevel(data.energyLevel || 3);
        setSleepHours(data.sleepHours || '');
        setExerciseMinutes(data.exerciseMinutes || '');
        setActivityLevel(data.activityLevel || 'light');
        setNotes(data.notes || '');
        setWeight(data.weight || '');
        setFastingGlucose(data.fastingGlucose || '');
        setAfterFoodGlucose(data.afterFoodGlucose || '');
        setBpSystolic(data.bpSystolic || '');
        setBpDiastolic(data.bpDiastolic || '');
        setSupplements(data.supplements || []);
      } else {
        // Reset to defaults for new date
        setMoodEmoji('neutral');
        setEnergyLevel(3);
        setSleepHours('');
        setExerciseMinutes('');
        setActivityLevel('light');
        setNotes('');
        setWeight('');
        setFastingGlucose('');
        setAfterFoodGlucose('');
        setBpSystolic('');
        setBpDiastolic('');
        setSupplements([]);
      }
    } catch (err) {
      console.error('Failed to load wellness data:', err);
    }
  };

  const handleSupplementToggle = (supplement) => {
    setSupplements(prev =>
      prev.includes(supplement)
        ? prev.filter(s => s !== supplement)
        : [...prev, supplement]
    );
  };

  const handleAddCustomSupplement = () => {
    if (customSupplement.trim() && !supplements.includes(customSupplement.trim())) {
      setSupplements([...supplements, customSupplement.trim()]);
      setCustomSupplement('');
    }
  };

  const handleRemoveSupplement = (supplement) => {
    setSupplements(prev => prev.filter(s => s !== supplement));
  };

  const handleLogWellness = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const wellnessData = {
        date: selectedDate,
        moodEmoji,
        energyLevel: parseInt(energyLevel),
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        exerciseMinutes: exerciseMinutes ? parseInt(exerciseMinutes) : null,
        activityLevel,
        notes,
        weight: weight ? parseFloat(weight) : null,
        fastingGlucose: fastingGlucose ? parseFloat(fastingGlucose) : null,
        afterFoodGlucose: afterFoodGlucose ? parseFloat(afterFoodGlucose) : null,
        bpSystolic: bpSystolic ? parseInt(bpSystolic) : null,
        bpDiastolic: bpDiastolic ? parseInt(bpDiastolic) : null,
        supplements,
      };

      const result = await logWellness(wellnessData);
      if (result) {
        setSuccess('Wellness logged successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to log wellness: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogSymptom = async () => {
    if (!symptomType) {
      setError('Please select a symptom');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const symptomData = {
        date: selectedDate,
        symptomType,
        severity: parseInt(symptomSeverity),
        description: symptomDescription,
      };

      const result = await logSymptom(symptomData);
      if (result) {
        setSuccess('Symptom logged successfully!');
        setSymptomType('');
        setSymptomSeverity(3);
        setSymptomDescription('');
        setShowSymptomForm(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to log symptom: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      {/* Header */}
      <div className="page-header">
        <h1>Wellness Tracking</h1>
        <p>Monitor your daily health and wellness metrics</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Date Selector */}
      <div className="date-selector-card">
        <label>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      {/* Health Metrics Section */}
      <div className="card health-metrics-section">
        <h3>Daily Health Metrics</h3>
        <div className="metrics-grid">
          {/* Weight */}
          <div className="metric-item">
            <label>Weight</label>
            <div className="input-group">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
                step="0.1"
                min="0"
                className="input-field"
              />
              <span className="input-unit">kg</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="metric-item">
            <label>Blood Pressure</label>
            <div className="bp-inputs">
              <div className="input-group">
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  placeholder="Systolic"
                  min="0"
                  max="300"
                  className="input-field bp-input"
                />
              </div>
              <span className="bp-separator">/</span>
              <div className="input-group">
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  placeholder="Diastolic"
                  min="0"
                  max="200"
                  className="input-field bp-input"
                />
              </div>
              <span className="input-unit">mmHg</span>
            </div>
          </div>

          {/* Fasting Glucose */}
          <div className="metric-item">
            <label>Fasting Glucose</label>
            <div className="input-group">
              <input
                type="number"
                value={fastingGlucose}
                onChange={(e) => setFastingGlucose(e.target.value)}
                placeholder="Before food"
                min="0"
                className="input-field"
              />
              <span className="input-unit">mg/dL</span>
            </div>
          </div>

          {/* After Food Glucose */}
          <div className="metric-item">
            <label>Post-Meal Glucose</label>
            <div className="input-group">
              <input
                type="number"
                value={afterFoodGlucose}
                onChange={(e) => setAfterFoodGlucose(e.target.value)}
                placeholder="After food"
                min="0"
                className="input-field"
              />
              <span className="input-unit">mg/dL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Supplements Section */}
      <div className="card supplements-section">
        <h3>Supplements Intake</h3>
        <p className="section-description">Select supplements you took today</p>

        {/* Selected Supplements */}
        {supplements.length > 0 && (
          <div className="selected-supplements">
            {supplements.map((supplement) => (
              <span key={supplement} className="supplement-tag">
                {supplement}
                <button
                  className="remove-supplement"
                  onClick={() => handleRemoveSupplement(supplement)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Common Supplements Grid */}
        <div className="supplements-grid">
          {commonSupplements.map((supplement) => (
            <button
              key={supplement}
              className={`supplement-btn ${supplements.includes(supplement) ? 'active' : ''}`}
              onClick={() => handleSupplementToggle(supplement)}
            >
              {supplement}
            </button>
          ))}
        </div>

        {/* Add Custom Supplement */}
        <div className="custom-supplement">
          <input
            type="text"
            value={customSupplement}
            onChange={(e) => setCustomSupplement(e.target.value)}
            placeholder="Add other supplement..."
            className="input-field"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSupplement()}
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleAddCustomSupplement}
          >
            Add
          </button>
        </div>
      </div>

      <div className="wellness-grid">
        {/* Mood Tracking */}
        <div className="card wellness-section">
          <h3>How's Your Mood?</h3>
          <div className="mood-selector">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                className={`mood-btn ${moodEmoji === mood.value ? 'active' : ''}`}
                onClick={() => setMoodEmoji(mood.value)}
                title={mood.label}
              >
                <span className="mood-emoji">{mood.emoji}</span>
              </button>
            ))}
          </div>
          <p className="mood-label">
            {moodOptions.find(m => m.value === moodEmoji)?.label}
          </p>
        </div>

        {/* Energy Level */}
        <div className="card wellness-section">
          <h3>Energy Level</h3>
          <div className="energy-slider">
            <input
              type="range"
              min="1"
              max="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className="slider"
            />
            <div className="energy-labels">
              <span>Low</span>
              <span className="energy-value">{energyLevel}/5</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="card wellness-section">
          <h3>Sleep</h3>
          <div className="input-group">
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Hours"
              step="0.5"
              min="0"
              max="24"
              className="input-field"
            />
            <span className="input-unit">hours</span>
          </div>
        </div>

        {/* Exercise */}
        <div className="card wellness-section">
          <h3>Exercise</h3>
          <div className="input-group">
            <input
              type="number"
              value={exerciseMinutes}
              onChange={(e) => setExerciseMinutes(e.target.value)}
              placeholder="Minutes"
              min="0"
              className="input-field"
            />
            <span className="input-unit">minutes</span>
          </div>
        </div>

        {/* Activity Level */}
        <div className="card wellness-section">
          <h3>Activity Level</h3>
          <div className="activity-buttons">
            {activityLevels.map((level) => (
              <button
                key={level.value}
                className={`activity-btn ${activityLevel === level.value ? 'active' : ''}`}
                onClick={() => setActivityLevel(level.value)}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="card notes-section">
        <h3>Daily Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did you feel throughout the day? Any observations?"
          className="notes-textarea"
          rows="4"
        />
        <button
          className="btn btn-primary btn-block mt-md"
          onClick={handleLogWellness}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Wellness Data'}
        </button>
      </div>

      {/* Symptom Tracking */}
      <div className="card symptom-section">
        <div className="section-header">
          <h3>Symptom Tracking</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSymptomForm(!showSymptomForm)}
          >
            {showSymptomForm ? 'Cancel' : '+ Add Symptom'}
          </button>
        </div>

        {showSymptomForm && (
          <div className="symptom-form">
            <div className="form-group">
              <label>Symptom Type</label>
              <select
                value={symptomType}
                onChange={(e) => setSymptomType(e.target.value)}
                className="symptom-select"
              >
                <option value="">Select a symptom...</option>
                {symptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Severity</label>
              <div className="severity-scale">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={symptomSeverity}
                  onChange={(e) => setSymptomSeverity(e.target.value)}
                  className="slider"
                />
                <div className="severity-labels">
                  <span>Mild</span>
                  <span className="severity-value">{symptomSeverity}/5</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={symptomDescription}
                onChange={(e) => setSymptomDescription(e.target.value)}
                placeholder="Describe your symptom..."
                className="symptom-textarea"
                rows="2"
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleLogSymptom}
              disabled={isLoading}
            >
              {isLoading ? 'Logging...' : 'Log Symptom'}
            </button>
          </div>
        )}
      </div>

      {/* Reference Values */}
      <div className="card reference-section">
        <h3>Reference Values</h3>
        <div className="reference-grid">
          <div className="reference-item">
            <strong>Blood Pressure</strong>
            <p>Normal: Below 120/80 mmHg</p>
            <p>Elevated: 120-129 / Below 80</p>
            <p>High: 130+ / 80+</p>
          </div>
          <div className="reference-item">
            <strong>Fasting Glucose</strong>
            <p>Normal: 70-100 mg/dL</p>
            <p>Pre-diabetic: 100-125 mg/dL</p>
            <p>Diabetic: 126+ mg/dL</p>
          </div>
          <div className="reference-item">
            <strong>Post-Meal Glucose</strong>
            <p>Normal: Below 140 mg/dL</p>
            <p>Pre-diabetic: 140-199 mg/dL</p>
            <p>Diabetic: 200+ mg/dL</p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card tips-section">
        <h3>Health Tips</h3>
        <ul className="tips-list">
          <li>Aim for 7-9 hours of quality sleep daily</li>
          <li>Stay hydrated - drink at least 8 glasses of water</li>
          <li>Regular exercise improves overall wellness</li>
          <li>Monitor blood pressure at the same time daily</li>
          <li>Take fasting glucose before breakfast</li>
          <li>Check post-meal glucose 2 hours after eating</li>
          <li>Track supplements to identify what works for you</li>
        </ul>
      </div>
    </div>
  );
};

export default WellnessPage;
