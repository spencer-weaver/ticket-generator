

document.addEventListener("DOMContentLoaded", () => {

    const apiBase = 'http://localhost:3000';
    const newEvent = document.getElementById('new-event');
    const eventSelect = document.getElementById('event-select');
    const databaseSelect = document.getElementById('database-select');
    const eventForm = document.querySelector(".event-form");
    const eventPopup = document.getElementById('event-popup');

    fetchEvents();
    fetchDatabases();

    newEvent.addEventListener('click', () => {
        eventPopup.style.display = 'flex';
    })

    function fetchEvents() {
        fetch(`${apiBase}/events`)
            .then(response => response.json())
            .then(events => {
                eventSelect.innerHTML = "";
                events.forEach(event => {
                    const option = document.createElement("option");
                    option.textContent = `${event.name}`;
                    option.value = event.name;
                    eventSelect.appendChild(option);
                });
            })
            .catch(error => console.error("error fetching events:", error));
    }

    function fetchDatabases() {
        fetch(`${apiBase}/databases`)
            .then(response => response.json())
            .then(events => {
                databaseSelect.innerHTML = "";
                events.forEach(event => {
                    const option = document.createElement("option");
                    option.textContent = `${event.name}`;
                    option.value = event.name;
                    databaseSelect.appendChild(option);
                });
            })
            .catch(error => console.error("error fetching events:", error));
    }

    eventForm.addEventListener("click", (event) => {
        if (event.target.tagName !== "BUTTON") return; 

        event.preventDefault();

        if (event.target.textContent.includes("Add Event")) {
            createEvent();
            eventPopup.style.display = 'none';
        } else if (event.target.textContent.includes("Add Database")) {
            createDatabase();
        }
    });

    function createEvent() {
        const eventName = document.getElementById("event-name").value;
        const eventDatabase = document.getElementById("database-select").value;

        fetch(`${apiBase}/add-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: eventName, database: eventDatabase }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("event created:", data);
            return fetchEvents()
        })
        .catch(error => console.error("error:", error));
    }

    function createDatabase() {
        const databaseName = document.getElementById("database-name").value;
        const databaseEndpoint = document.getElementById("database-endpoint").value;

        fetch(`${apiBase}/add-database`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: databaseName, endpoint: databaseEndpoint }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("database created:", data);
            return fetchDatabases();
        })
        .catch(error => console.error("error:", error));
    }
});