let data = []; 
const CHART_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#FF9F76', '#A3D8F4', '#D4A5A5',
    '#B5EAD7', '#FFB347', '#77DD77', '#FDFD96'
];


function fetchData() {
    fetch('/data')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData; 
            renderTable(data);
            renderCharts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}


function renderTable(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; 
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.Time}</td>
            <td>${row.Day_of_week}</td>
            <td>${row.Age_band_of_driver}</td>
            <td>${row.Sex_of_driver}</td>
            <td>${row.Accident_severity}</td>
        `;
        tableBody.appendChild(tr);
    });
}


function renderCharts(data) {
    const severityCounts = {};
    const dayOfWeekCounts = {};

    data.forEach(row => {
        severityCounts[row.Accident_severity] = (severityCounts[row.Accident_severity] || 0) + 1;
        dayOfWeekCounts[row.Day_of_week] = (dayOfWeekCounts[row.Day_of_week] || 0) + 1;
    });

    const severityChart = new Chart(document.getElementById('severityChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(severityCounts),
            datasets: [{
                label: 'Accident Severity',
                data: Object.values(severityCounts),
                backgroundColor: CHART_COLORS.slice(0,3),
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Accidents severity',
                    color: '#ffffff',
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const dayOfWeekChart = new Chart(document.getElementById('dayOfWeekChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(dayOfWeekCounts),
            datasets: [{
                label: 'Day of Week',
                data: Object.values(dayOfWeekCounts),
                backgroundColor: CHART_COLORS.slice(0,7),
                borderColor:'#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    textShadowColor: 'rgba(0,0,0,0.8)',
                    textShadowBlur: 5
                }
            }
        }
    });
}



function applyFilters() {
    const dayOfWeek = document.getElementById('day_of_week').value;
    const accidentSeverity = document.getElementById('accident_severity').value;

    const filteredData = data.filter(row => {
        return (!dayOfWeek || row.Day_of_week === dayOfWeek) &&
               (!accidentSeverity || row.Accident_severity === accidentSeverity);
    });

    renderTable(filteredData);
    renderCharts(filteredData);
    console.log("Working applyFilters");
}


function clearFilters() {
    document.getElementById('day_of_week').value = "";
    document.getElementById('accident_severity').value = "";
}

const accidentData = {
    "Andhra Pradesh (Due to weather)": 19509 ,
    "Arunachal Pradesh": 134,
    "Assam": 6595,
    "Bihar": 8639,
    "Chhattisgarh": 11656,
    "Goa": 2375,
    "Gujarat": 13398,
    "Haryana": 9431,
    "Himachal Pradesh": 2239,
    "Jammu and Kashmir": 4860,
    "Jharkhand": 4405,
    "Karnataka": 34178,
    "Kerala": 27877,
    "Madhya Pradesh": 45266,
    "Maharashtra": 24971,
    "Manipur": 432,
    "Meghalaya": 214,
    "Mizoram": 53,
    "Nagaland": 500,
    "Odisha": 9817,
    "Punjab": 5203,
    "Rajasthan": 19114,
    "Sikkim": 138,
    "Tamil Nadu": 45484,
    "Telangana": 19172,
    "Tripura": 466,
    "Uttarakhand": 1041,
    "Uttar Pradesh": 34243,
    "West Bengal": 9180,
    "Andaman and Nicobar Islands": 141,
    "Chandigarh": 159,
    "Dadra and Nagar Haveli": 100,
    "Daman and Diu": "NA",
    "Delhi": 4178,
    "Lakshadweep": 1,
    "Puducherry": 969,
    "Ladakh":20,
    "Total": 366158
};


const svgPath = document.querySelectorAll('svg path');
const toggle = document.getElementById('toggle');

        svgPath.forEach(item =>{
            item.addEventListener('mouseover', (event) =>{
                const x = event.clientX + window.scrollX;
                const y = event.clientY + window.scrollY;
                const stateName = item.getAttribute('name');
                const accidentCount = accidentData[stateName] || 'Data not available';

                toggle.style.left = `${x}px`;
                toggle.style.top = `${y}px`;
                toggle.innerHTML = `${stateName}: ${accidentCount}`;
                toggle.style.display = 'block';
                
            })
            item.addEventListener('mouseout', ()=>{
                toggle.style.display = 'none';
            })
        })

fetchData();
