import React, { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, Tooltip
} from 'recharts';
const axios = require('axios');

const COLORS = ['gold', 'black', 'green'];


export default function PieComponent() {

    const [newData, setNew] = useState([]);
    const [totalData, setTotal] = useState([]);

    useEffect(() => {
        (async function fetchData() {
            const { data } = await axios.get('https://api.covid19api.com/summary')
            setNew([{ name: 'New Confirmed', value: data.Global.NewConfirmed }, { name: 'New Deaths', value: data.Global.NewDeaths }, { name: 'New Recovered', value: data.Global.NewRecovered }])
            setTotal([{ name: 'Total Confirmed', value: data.Global.TotalConfirmed }, { name: 'Total Deaths', value: data.Global.TotalDeaths }, { name: 'Total Recovered', value: data.Global.TotalRecovered }])
        })();
    }, [])

    return (
        <>
            <h1>Global View</h1>

            <h2>New Cases</h2>
            <PieChart width={800} height={230}>
                <Pie
                    data={newData}
                    cx={150}
                    cy={120}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label nameKey="name"
                >
                    {
                        newData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>

                <Tooltip />
            </PieChart >
            <h2>Total Cases</h2>
            <PieChart width={800} height={230}>
                <Pie
                    data={totalData}
                    cx={150}
                    cy={120}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label nameKey="name"
                >
                    {
                        totalData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>

                <Tooltip />
            </PieChart >
        </>
    );
}

