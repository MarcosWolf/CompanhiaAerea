function getFlights() {
    // Obter os dados das viagens
    const flightsContent = document.getElementById("textarea-flights").value;
    const flights = flightsContent.split("\n");

    // Obter os dados das linhas aéreas
    const airlinesContent = document.getElementById("textarea-airlines").value;
    const airlines = airlinesContent.split("\n");

    console.log(airlines);

    flights.forEach((flight) => {
        // Dividir os dados em variaveis
        const [routes, duration] = flight.split(";");
        const [pointA, pointB] = routes.split(" x ");
        const route = `${pointA.trim()} x ${pointB.trim()}`;

        // Sortear qual linha aérea irá pegar a viagem
        const randomizeAirlines = airlines[Math.floor(Math.random() * airlines.length)];

        console.log(route, "-", duration, " minutos de duração -", randomizeAirlines);
    });
}

getFlights();