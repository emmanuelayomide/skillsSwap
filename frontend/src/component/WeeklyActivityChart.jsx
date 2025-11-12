import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5000/api/user/weekly'; 

// Custom Tooltip component to show "H"
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', border: '1px solid #ccc', padding: '5px' }}>
        <p className="label">{`${label}`}</p>
        <p className="intro">{`Active Time: ${payload[0].value} H`}</p>
      </div>
    );
  }
  return null;
};
const token = localStorage.getItem("token");


function WeeklyActivityChart() {
  // Update state to handle two values
  const [dailyData, setDailyData] = useState([]);
  const [totalHours, setTotalHours] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
          });
        // Destructure the new response structure
        setDailyData(response.data.dailyData); 
        console.log(dailyData.dailyData)
        setTotalHours(response.data.totalHours);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load activity data.");
        setIsLoading(false);
      }
    };
    fetchActivityData();
  }, []);

  if (isLoading) {
    return <div>Loading activity chart...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (dailyData.length === 0) {
      return (
          <div style={{ padding: '10px', textAlign: 'center' }}>
              No activity recorded yet for the last 7 days.
          </div>
      );
  }

  return (
    <div style={{ width: '100%', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '10px' }}>
      
      {/* NEW: Total Hours Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Activity</h3>
        <button style={{ padding: '5px 10px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Weekly ▼</button>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
        {totalHours} H
      </div>
      
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            {/* Hiding the YAxis labels to make it clean like your example */}
            <YAxis hide={false} domain={[0, totalHours * 1.5]} /> 
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="hours" 
              fill="#a29bfe" // A nice lavender color
              radius={[10, 10, 0, 0]} // Rounded tops
              barSize={30} // Consistent bar size
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );


  
}

export default WeeklyActivityChart;