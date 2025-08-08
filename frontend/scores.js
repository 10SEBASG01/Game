window.onload = function() {
    cargarPuntuaciones();
};

async function cargarPuntuaciones() {
    const listaPuntuaciones = document.getElementById('listaPuntuaciones');
    const backendUrl = '/api/puntuaciones';

    try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
            throw new Error('No se pudo conectar al servidor');
        }

        const puntuaciones = await response.json();
        
        listaPuntuaciones.innerHTML = ''; 

        if (puntuaciones.length === 0) {
            listaPuntuaciones.innerHTML = '<li>Aún no hay puntajes. ¡Sé el primero!</li>';
        } else {
            puntuaciones.forEach((p, index) => {
                const li = document.createElement('li');
                const rankSpan = document.createElement('span');
                rankSpan.className = 'rank';
                rankSpan.textContent = `#${index + 1}`;

                const nameSpan = document.createElement('span');
                nameSpan.className = 'name';
                nameSpan.textContent = p.nombre;

                const scoreSpan = document.createElement('span');
                scoreSpan.className = 'score';
                scoreSpan.textContent = `${p.puntaje} pts`;

                li.appendChild(rankSpan);
                li.appendChild(nameSpan);
                li.appendChild(scoreSpan);
                
                listaPuntuaciones.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error al obtener puntuaciones:', error);
        listaPuntuaciones.innerHTML = '<li>Error al cargar las puntuaciones.</li>';
    }
}