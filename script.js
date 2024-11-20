let canvas = document.getElementById('bloodPressureChart').getContext('2d');
let canvasIndex;
let patients = document.querySelectorAll('.layer');
let respiratoryRate = document.querySelector('#box1 h2')
let respiratoryLevel = document.querySelector('#box1 p')
let temperature = document.querySelector('#box2 h2')
let temperatureLevel = document.querySelector('#box2 p')
let heartRate = document.querySelector('#box3 h2')
let heartLevel = document.querySelector('#box3 p')
let systolicValue = document.querySelector('main #Diagnosis-details  #systValue');
let systolicLevel = document.querySelector('main #Diagnosis-details #syslevel');
let diastolicValue = document.querySelector('main #Diagnosis-details  #diasValue');
let diastolicLevel = document.querySelector('main #Diagnosis-details #diaslevel');
let profilePic = document.getElementById('profile');
let profileName = document.querySelector('aside h3')
let profileDob = document.getElementById('dob');
let profileGender = document.getElementById('gender');
let profileNo = document.getElementById('no');
let profileEmgNo = document.getElementById('emgNo');
let profileInsurence = document.getElementById('ins');
let diagnosisTbody = document.getElementById('tableBody');
let labResult = document.querySelector('.container');


var baseURL = 'https://fedskillstest.coalitiontechnologies.workers.dev';
let userName = 'coalition';
let password = 'skills-test';
let auth = btoa(`${userName}:${password}`)

fetch(baseURL, {
    headers:{
        'Authorization' : `Basic ${auth}`
    }
}).then((response)=>{
    return response.json();
}).then((data)=>{
    updateUI(data);
}).catch((error)=>{
    console.warn(error);
})


function updateUI(data){

    patients.forEach((patient)=>{
        patient.addEventListener('click',()=>{
            let patientName = patient.querySelector('.layer-details h4')
            for (let i = 0; i< data.length; i++) {
                if(data[i].name === patientName.textContent){
                    fetchDiagnosisDetails(data[i].diagnosis_history);
                    fetchDiagnosisList(data[i]);
                    fetchPatientProfile(data[i]);
                    fetchLabResults(data[i].lab_results);
                }
            }
        })
    })
    
    
}

function fetchDiagnosisDetails(data){ 
    let n = 5;
    let labels = [];
    let months = [];
    for(let i=0; i <= n ;i++ ){
        months[i] = data[n-i].month;
    }

    for(let i=0; i<=n; i++){
        const obj ={
                'mm-yy': `${months[i].slice(0,3)},${data[n-i].year}`,
                'systolicData': data[n-i].blood_pressure.systolic.value,
                'diastolicData': data[n-i].blood_pressure.diastolic.value
        }

        labels.push(obj);
    }

    respiratoryRate.innerText = `${data[0].respiratory_rate.value} bpm`;
    temperature.innerText = `${data[0].temperature.value}°F`;
    heartRate.innerText = `${data[0].heart_rate.value} bpm`;
    systolicValue.innerText = labels[n].systolicData;
    diastolicValue.innerText = labels[n].diastolicData;
    respiratoryLevel.innerText = data[0].respiratory_rate.levels;
    temperatureLevel.innerText = data[0].temperature.levels;
    heartLevel.innerText = data[0].heart_rate.levels;
    systolicLevel.innerText = data[0].blood_pressure.systolic.levels;
    diastolicLevel.innerText = data[0].blood_pressure.diastolic.levels;

    
    drawBloodPressureChart(labels);    
}

function drawBloodPressureChart(labels){
    if(canvasIndex){
        canvasIndex.destroy();
    }

    canvasIndex = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels.map(row=>row["mm-yy"]),
            datasets: [{
                label: '',
                data: labels.map(data => data["systolicData"]), 
                borderWidth: 2,
                borderColor: '#C26EB4',
                tension: 0.4,
                fill: false,
                pointRadius: 5,                        
                pointBackgroundColor: '#C26EB4',          
                pointBorderColor: '#C26EB4',
                pointHoverRadius: 7  
            },{
                label: '',
                data: labels.map(data => data["diastolicData"]), 
                borderColor: '#7E6CAB',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                fill: false,
                pointRadius: 5,                        
                pointBackgroundColor: '#7E6CAB',          
                pointBorderColor: '#7E6CAB',
                pointHoverRadius: 7  
            }]
        },
        options: {
            responsive:true,
            scales: {
                y: {
                    beginAtZero: true,
                    min:60,
                    max:180
                }
            },
            plugins :{
                legend: {
                    display: false
                }
            }
        }
    });
}

function fetchDiagnosisList(data){
   
    diagnosisTbody.innerHTML = '';

    data.diagnostic_list.forEach(diagnosis =>{
        //create a new row
        let row = document.createElement('tr');
        
        // create new cells 
        let nameCell = document.createElement('td');
        nameCell.innerText = diagnosis.name;
        row.appendChild(nameCell)

        let descriptionCell = document.createElement('td');
        descriptionCell.innerText = diagnosis.description;
        row.appendChild(descriptionCell)

        let statusCell = document.createElement('td');
        statusCell.innerText = diagnosis.status;
        row.appendChild(statusCell)

        diagnosisTbody.appendChild(row)
    })
}

function fetchPatientProfile(data){
    let newSrc = data.profile_picture;
    profilePic.src = newSrc;
    profileName.innerText = data.name;
    profileDob.innerText = data.date_of_birth;
    profileGender.innerText = data.gender;
    profileNo.innerText = data.phone_number;
    profileEmgNo.innerText = data.emergency_contact;
    profileInsurence.innerText = data.insurance_type;
}

function fetchLabResults(data){
    labResult.innerHTML = '';
    for(let i=0; i<data.length; i++){
        let labDiv = document.createElement('div')
        labDiv.setAttribute('class', 'res');
        labResult.appendChild(labDiv)
        let para = document.createElement('p');
        para.innerHTML = data[i];
        labDiv.appendChild(para);
        let img = document.createElement('img')
        img.setAttribute('src', './assets/downloadIcon.png')
        labDiv.appendChild(img)
    }
}
