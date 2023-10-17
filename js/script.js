function getFlights() {
    const flightsItinerary = document.getElementById("itinerary-flights");
    const reportsItinerary = document.getElementById("itinerary-reports");
    const updateButton = document.getElementById("btn_updateItinerary");

    let flightsIndex = 0;
    let updated = false;
    let flightsData = null;
    let airlinesData = null;
    let flightAirlinesMap = {};
    let displayedFlights = new Set();
    let displayedReports = [];

    const flightsLimit = 5;
    const reportsLimit = 3;
    let cycleCount = 0;
    const maxCycles = 10;

    function updateFlights() {
        if (!updated) {
            const flightsContent = document.getElementById("textarea-flights").value;
            flightsData = flightsContent.split("\n").filter(flight => {
                const [routes, duration] = flight.split(";");
                const [pointA, pointB] = routes.split(" x ");
                return pointA.trim() && pointB.trim() && duration.trim();
            });

            const airlinesContent = document.getElementById("textarea-airlines").value;
            airlinesData = airlinesContent.split("\n");

            updated = true;
        }

        flightsItinerary.innerHTML = "";

        if (flightsData.length === 0) {
            const noFlightsParagraph = document.createElement("p");
            noFlightsParagraph.textContent = "Sem viagens programadas.";
            flightsItinerary.appendChild(noFlightsParagraph);
            return;
        }

        let flightsAdded = 0;
        const totalFlights = flightsData.length;
        for (let i = flightsIndex; flightsAdded < flightsLimit && cycleCount < maxCycles; i++) {
            const flight = flightsData[i % totalFlights];
            if (!displayedFlights.has(flight)) {
                const [routes, duration] = flight.split(";");
                const [pointA, pointB] = routes.split(" x ");
                const route = `${pointA.trim()} x ${pointB.trim()}`;

                let airlines;
                if (flightAirlinesMap[route]) {
                    airlines = flightAirlinesMap[route];
                } else {
                    airlines = airlinesData[Math.floor(Math.random() * airlinesData.length)];
                    flightAirlinesMap[route] = airlines;
                }

                const flightsParagraph = document.createElement("p");
                flightsParagraph.textContent = `${route} - ${duration} minutos de duração - ${airlines}`;

                flightsItinerary.appendChild(flightsParagraph);

                displayedFlights.add(flight);
                flightsAdded++;
            }
            if (i % totalFlights === 0) {
                cycleCount++;
            }
        }
        flightsIndex = (flightsIndex + flightsAdded) % totalFlights;
        if (flightsIndex === 0) {
            displayedFlights.clear();
            cycleCount = 0;
        }
    }

    function updateReports() {
        reportsItinerary.innerHTML = "";
        for (let i = 0; i < reportsLimit && displayedReports.length > 0; i++) {
            const reportsParagraph = document.createElement("p");
            reportsParagraph.textContent = displayedReports.shift();
            reportsItinerary.appendChild(reportsParagraph);
        }

        if (displayedReports.length === 0) {
            displayedReports = generateReportData();
        }
    }

    function generateReportData() {
        const airlinesFlightsMap = {};
        const airlinesDurationMap = {};
    
        for (const flight of flightsData) {
            const [routes, duration] = flight.split(";");
            const [pointA, pointB] = routes.split(" x ");
            const route = `${pointA.trim()} x ${pointB.trim()}`;
    
            if (!flightAirlinesMap[route]) {
                continue;
            }
    
            const airlines = flightAirlinesMap[route];
    
            if (!airlinesFlightsMap[airlines]) {
                airlinesFlightsMap[airlines] = 0;
                airlinesDurationMap[airlines] = 0;
            }
    
            airlinesFlightsMap[airlines] += 1;
            airlinesDurationMap[airlines] += parseInt(duration);
        }
    
        return Object.keys(airlinesFlightsMap).map(
            airlines => `${airlines} - ${airlinesFlightsMap[airlines]} voos - tempo total: ${airlinesDurationMap[airlines]} minutos`
        );
    }

    updateButton.addEventListener("click", () => {
        updated = false;
        flightsIndex = 0;
        displayedFlights.clear();
        cycleCount = 0;
        flightAirlinesMap = {};
    });

    updateFlights();
    updateReports();

    setInterval(() => {
        updateFlights();
        updateReports();
    }, 3000);
}

getFlights();