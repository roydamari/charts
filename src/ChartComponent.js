import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DropdownButton, Dropdown } from "react-bootstrap";
const axios = require('axios');

export default function ChartComponent() {

    const [data, setData] = useState([]);
    const [chart, setChart] = useState([])
    const [max, setMax] = useState(-1);

    function csvJSON(csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split(",");
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split(",");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        result.forEach(element => {
            if (element['Province/State']) {
                element.State = element['Country/Region'] + ' - ' + element['Province/State'];
            } else {
                element.State = element['Country/Region'];
            }
        });

        return result;
    }

    function hasNumber(myString) {
        return /\d/.test(myString);
    }

    useEffect(() => {
        const nums = [];
        chart.forEach(element => {
            if (element.first) {
                nums.push(parseInt(element[element.first]));
            }
            if (element.second) {
                nums.push(parseInt(element[element.second]));
            }
        });
        setMax(Math.max(...nums))

    }, [chart])

    useEffect(() => {
        (async function fetchData() {
            const { data } = await axios.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv');
            setData(csvJSON(data));
        })();
    }, [])

    function firstCountry(e) {
        const country = data.find(element => element.State === e.currentTarget.text);
        const active = [];
        const props = Object.getOwnPropertyNames(country);
        props.forEach(propName => {
            if (hasNumber(propName)) {
                active.push({ first: country.State, [country.State]: country[propName], date: propName });
            }
        });
        setChart(active);
    }


    function secondCountry(e) {
        const country = data.find(element => element.State === e.currentTarget.text);
        const active = [];
        const props = Object.getOwnPropertyNames(country);
        props.forEach(propName => {
            if (hasNumber(propName)) {
                active.push({ second: country.State, [country.State]: country[propName], date2: propName });
            }
        });
        const newChart = [];
        chart.forEach((element, i) => {
            newChart.push({ ...element, ...active[i] })
        });
        setChart(newChart);
    }

    return (
        <>
            <h1>Country Comparison</h1>
            <DropdownButton id="dropdown-basic-button" title={!chart[0] ? "Select a Country" : chart[0].first}>
                {data && data.map((prop, i) => {
                    return <Dropdown.Item onClick={firstCountry} key={i}>{prop.State}</Dropdown.Item>;
                })}
            </DropdownButton> <br />
            <DropdownButton id="dropdown-basic-button" title={!chart[0] || !chart[0].second ? "Select a Country" : chart[0].second} disabled={!chart[0]}>
                {data && data.map((prop, i) => {
                    return <Dropdown.Item onClick={secondCountry} key={i}>{prop.State}</Dropdown.Item>;
                })}
            </DropdownButton>
            {chart.length > 0 && <ResponsiveContainer width="95%" height={400}>
                <LineChart data={chart}>
                    <Line type="monotone" dataKey={chart[0].first} stroke="#8884d8" />
                    <Line type="monotone" dataKey={chart[0].second} stroke="#4fad56" />
                    <CartesianGrid stroke="#ccc" vertical={false} />
                    <Tooltip />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, max * 1]} />
                    <Legend />
                </LineChart>
            </ResponsiveContainer >}
        </>
    );
}
