
import { refreshToken, logout } from "./api.js";
import { signup, validCode } from "./code-api.js";

const signoutButton = document.getElementById('signout-button');
const uploadGroupButton = document.getElementById('upload-group-csv');
const fileInput = document.getElementById('csv-file-input');

const elementMapping = {
    'event-name': 'name',
    'num-tables': 'numberOfTables',
    'total-capacity': 'totalCapacity',
    'current-capacity': 'currentCapacity',
    'tables': 'tables',
    'seats': 'seats',
    'users-data': 'usersData',
};

async function checkAuth() {
    let accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        await refreshToken();
        accessToken = localStorage.getItem('accessToken');
    }

    if (!accessToken) {
        window.location.href = '/index.html';
    } else {
        console.log("user authenticated");
    }
}

signoutButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await logout();
    location.href = './index.html';
})

uploadGroupButton.addEventListener('click', async (event) => {
    event.preventDefault();
    fileInput.click(); 
})

fileInput.addEventListener('change', async function() {
    const file = this.files[0];

    if (!file) {
        alert('please select a CSV file.');
        return;
    }

    const parsedData = await parseCSV(file);

    console.log('parsed data:', parsedData);

    parsedData.forEach(async (row, index) => {
        const email = row.email;
        const accessCode = await generateAccessCode();
        await signup({ email, code: accessCode});
    });

    fileInput.value = '';
});

async function generateAccessCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const response = validCode(code);
    if (response.ok) {
        return generateAccessCode();
    }
    return code;
}

function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true, // Assuming the first row contains headers
            skipEmptyLines: true, // Skip empty lines in the CSV
            complete: function(results) {
                console.log('parsed CSV results:', results);
                resolve(results.data); // Resolve the promise with the parsed data
            },
            error: function(error) {
                reject(error); // Reject the promise if there's an error
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    await checkAuth();
    const eventId = '67d88b3e310c278fde2aa55c'; // Example event ID (replace with actual ID)

    function fetchAndDisplayData(url, elementId) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    document.getElementById(elementId).textContent = `Error: ${data.error}`;
                    return;
                }

                // Check if the element should handle an array (like tables)
                if (Array.isArray(data.tables)) {
                    const tablesContainer = document.getElementById(elementId);

                    data.tables.forEach((table, index) => {
                        const tableDiv = document.createElement('div');
                        tableDiv.classList.add('table-item');
                        tableDiv.style.cursor = 'pointer';
                        const belowTableDiv = document.createElement('div');
                        belowTableDiv.classList.add('below-table-item');
                        belowTableDiv.style.display = 'none'; // Initially hidden

                        // Table info
                        const tableNumberDiv = document.createElement('div');
                        tableNumberDiv.textContent = `Table ${table.tableNumber}`;
                        tableNumberDiv.classList.add('table-header');

                        const tableCapacityDiv = document.createElement('div');
                        tableCapacityDiv.textContent = `Capacity: ${table.capacity}`;

                        const tableAvailableSeatsDiv = document.createElement('div');
                        tableAvailableSeatsDiv.textContent = `Remaining seats: ${table.availableSeats}`;

                        // Collapsible seats container
                        const seatsContainer = document.createElement('div');
                        seatsContainer.classList.add('seats-collapse');

                        // Generate seats inside the collapsible section
                        table.seats.forEach((seat) => {
                            const seatDiv = document.createElement('div');
                            seatDiv.classList.add('seat-item');

                            const seatNumberDiv = document.createElement('div');
                            seatNumberDiv.textContent = `Seat ${seat.seatNumber}`;

                            const seatAvailable = document.createElement('div');
                            seatAvailable.textContent = `${seat.isReserved ? 'Reserved' : 'Available'}`;

                            seatDiv.appendChild(seatNumberDiv);
                            seatDiv.appendChild(seatAvailable);
                            seatsContainer.appendChild(seatDiv);
                        });

                        // Toggle seats visibility on click
                        tableDiv.addEventListener('click', () => {
                            belowTableDiv.style.display = (belowTableDiv.style.display === 'none') ? 'block' : 'none';
                        });

                        // Append elements
                        tableDiv.appendChild(tableNumberDiv);
                        tableDiv.appendChild(tableCapacityDiv);
                        tableDiv.appendChild(tableAvailableSeatsDiv);
                        belowTableDiv.appendChild(seatsContainer);
                        tablesContainer.appendChild(tableDiv);
                        tablesContainer.appendChild(belowTableDiv);
                    });
                } else if (Array.isArray(data.usersData)) {

                } else {
                    const property = elementMapping[elementId];
                    document.getElementById(elementId).textContent = `${data[property]}`;
                }
            })
            .catch(error => {
                document.getElementById(elementId).textContent = 'Error fetching data';
                console.error('Error:', error);
            });
    }

    fetchAndDisplayData(`https://api.sweaver.ca/dash/name?eventId=${eventId}`, 'event-name');
    fetchAndDisplayData(`https://api.sweaver.ca/dash/numTables?eventId=${eventId}`, 'num-tables');
    fetchAndDisplayData(`https://api.sweaver.ca/dash/totalCapacity?eventId=${eventId}`, 'total-capacity');
    fetchAndDisplayData(`https://api.sweaver.ca/dash/currentCapacity?eventId=${eventId}`, 'current-capacity');
    fetchAndDisplayData(`https://api.sweaver.ca/dash/tables?eventId=${eventId}`, 'tables-scroll');
});