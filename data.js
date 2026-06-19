// Exportamos las fechas y los datos para que script.js los lea
const TARGET_DATE = new Date("2026-10-28T00:00:00").getTime(); // Fecha de Aniversario

const weeklyData = [
    { 
        week: 1, 
        unlockDate: "2026-06-22", 
        title: "Capítulo 01",
        quote: "«He luchado en vano. Ya no puedo más. Soy incapaz de contener mis sentimientos. Permítame que le diga que la admiro y la amo apasionadamente». Fitzwilliam Darcy",
        message: "Oficialmente empieza nuestra cuenta regresiva hacia nuestro primer aniversario amor mío. Sé que estos meses separados se sienten como una eternidad, pero quise dejarte este pequeño rincón nuestro.\n\nSirve una taza de café, imagina que estoy ahí contigo del otro lado de la mesa, y recuerda que cada día que tachamos en el calendario es un día menos para volver a vernos. Te extraño a cada instante mi vida.",
        tidalID: "33986409",
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 2, 
        unlockDate: "2026-06-29", 
        title: "Capítulo 02",
        quote: null,
        message: "Sobrevivimos una semana más. Hoy estuviste en mi mente como cada día y a cada momento, escuchando esta canción no pude hacer otra cosa más que extrañarte.",
        tidalID: "629019",
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 3, 
        unlockDate: "2026-07-06", 
        title: "Capítulo 03",
        quote: "«Daría todo lo que tengo porque fueras tú quien esté sobre la mesa. Pasearía mi boca por tus muslos, para después meter mi lengua en tu interior y hacerte mía». Eric Zimmerman",
        message: "Llevamos semanas sin tocarnos y extraño cada centímetro de tu piel, extraño sentir tu interior, tener tu sabor en mi boca y escuchar tu placer.\n\nPara esta semana te tengo un pequeño reto: la próxima vez que estemos juntos, quiero que me confieses al oído cuál fue exactamente el momento en que más nerviosa te he puesto. Yo ya tengo mi respuesta preparada, y te aseguro que involucra esa mirada tuya que tanto me vuelve loco.",
        spotifyId: null,
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 4, 
        unlockDate: "2026-07-13", 
        title: "Capítulo 04",
        quote: null,
        message: "«Toco tu boca, con un dedo toco el borde de tu boca, voy dibujándola como si saliera de mi mano, como si por primera vez tu boca se entreabriera, y me basta cerrar los ojos para deshacerlo todo y recomenzar, hago nacer cada vez la boca que deseo, la boca que mi mano elige y te dibuja en la cara, una boca elegida entre todas, con soberana libertad elegida por mí para dibujarla con mi mano por tu cara, y que por un azar que no busco comprender coincide exactamente con tu boca que sonríe por debajo de la que mi mano te dibuja». Julio Cortázar",
        spotifyId: null,
        hasRoulette: true,
        hasScratchCard: false
    },
    { 
        week: 5, 
        unlockDate: "2026-07-20", 
        title: "Capítulo 05",
        quote: "«De todos los vicios que tengo, extrañarte es el más difícil de dejar.»",
        message: "Ya avanzamos un mes completo más. Cada que escucho esta canción apareces en mi mente y en mi corazón, ojalá ella pueda explicar de mejor manera el amor que por ti siento donde mis palabras se han quedado cortas. Te amo mi amor",
        // ID de "Cien Años" de Pedro Infante (Un contraste brutal y romántico)
        tidalID: "5099431", 
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 6, 
        unlockDate: "2026-08-10", 
        title: "Capítulo 06",
        quote: null,
        message: "Llegamos al sexto capítulo y es hora de volver a jugar.\n\nComo lo prometido es deuda, aquí tienes tu segundo pase para la Ruleta. Tira de nuevo y suma un cupón más. Prepárate, porque pienso cumplirlos todos y cada uno de ellos sin excusas. Tu decidirás cual cumplir primero princesa",
        spotifyId: null,
        hasRoulette: true,
        hasScratchCard: false
    },
    { 
        week: 7, 
        unlockDate: "2026-08-17", 
        title: "Capítulo 07",
        quote: "«El amor es más sabio que la sabiduría.» — Umberto Eco",
        message: "Me encanta sumergirme en libros y película de misterios complicados.Pero si soy sincero, el enigma que más me gusta descifrar es ese que aparece en tu cara al estar junto a ti. Eres el único libro que quiero leer de principio a fin, una y otra vez. Ya quiero tenerte a mi lado para seguir investigando.",
        spotifyId: null,
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 8, 
        unlockDate: "2026-07-27", 
        title: "Capítulo 08",
        quote: "«En mis sueños más inquietos, veo ese lugar...»",
        message: "Esta canción me hace recordar el primer beso que te di. Robert Smith dice que habla de esa sensación de besar a alguien hasta desmayarse de la emoción, y eso es exactamente lo que siento en cada momento juntos que pasamos. Eres mi pedacito de cielo en la Tierra. Escúchala pensando en nosotros como yo lo hago en ti.",
        tidalID: "2269936",
        hasRoulette: false,
        hasScratchCard: false
    },
    { 
        week: 9, 
        unlockDate: "2026-09-07", 
        title: "Capítulo 09",
        quote: "«No me extrañes, corazón... mejor ven y búscame en mi rincón.»",
        message: "Esta vez no giraremos una ruleta. Tienes tres opciones ocultas frente a ti.\n\nElige sabiamente y descubre lo que te espera.",
        hasRoulette: false,
        hasScratchCard: true, // ¡La nueva bandera activada!
        scratchPrizes: [
            "Un refugio compartido entre mantas y sombras, donde el único momento que importa es el roce de nuestros labios. 🕯️",
            "Un encuentro para nuestro paladar; el pretexto perfecto para deleitarnos con los sabores que tanto nos gustan y perderme en el brillo de tus ojos. 🍷",
            "Promesa de un placer interminable, donde mis labios y mi lengua serán los únicos autores de tu rendición. 🔥"
            // Otras opciones picantes que me diste: "Cumplimos tu fantasía pendiente 😈" o "Tú eliges la nueva posición hoy 🥵"
        ],
        spotifyId: null 
    },
    // Rellena las semanas del 3 al 17 aquí siguiendo el mismo formato
    // { week: 3, unlockDate: "2026-07-06", title: "Capítulo 03: ...", quote: null, message: "...", spotifyId: null },
    // { week: 4, unlockDate: "2026-07-13", ... },
    { 
        week: 18, 
        unlockDate: "2026-10-28", 
        title: "Capítulo 18: El Final de la Espera",
        quote: "«De todos los misterios del universo, el único que vale la pena resolver es el que está a nuestro lado.»",
        message: "¡Llegamos a la meta! Feliz primer aniversario, Montserrat. Esta cuenta regresiva termina hoy, pero nuestra historia apenas empieza. Nos vemos en unas horas.",
        spotifyId: null 
    }
];

// Generador automático temporal para las semanas vacías (así no rompe la interfaz si aún no has escrito todas)
for (let i = 3; i <= 17; i++) {
    let dateObj = new Date("2026-06-22");
    dateObj.setDate(dateObj.getDate() + ((i - 1) * 7)); // Suma 7 días por cada semana
    let isoStr = dateObj.toISOString().split('T')[0];

    if (!weeklyData.find(d => d.week === i)) {
        weeklyData.push({
            week: i,
            unlockDate: isoStr,
            title: `Capítulo ${String(i).padStart(2, '0')}`,
            quote: null,
            message: `[Mensaje confidencial de la semana ${i} encriptado. Pendiente de escribir...]`,
            spotifyId: null
        });
    }
}