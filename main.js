document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. ANIMACIÓN SCROLL REVEAL (VIGILANTE)
       ========================================= */
    // Esto busca todo lo que tenga clase "reveal" y lo activa al verlo
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando se ve el 10% del elemento
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Deja de vigilar una vez animado
            }
        });
    }, observerOptions);

    // Ponemos a vigilar a todos los elementos .reveal
    const elementosAAnimar = document.querySelectorAll('.reveal');
    elementosAAnimar.forEach(el => observer.observe(el));


    /* =========================================
       2. MENÚ HAMBURGUESA (MÓVIL)
       ========================================= */
    const botonMenu = document.querySelector('.menu-toggle');
    const menuNavegacion = document.querySelector('.main-nav');

    if(botonMenu){
        botonMenu.addEventListener('click', () => {
            menuNavegacion.classList.toggle('active');
        });
    }

    /* =========================================
       3. EFECTO HÍBRIDO (FOTOS + VIDEO FLOTANTE)
       ========================================= */
    const magicWords = document.querySelectorAll('.magic-word');
    const cursorImg = document.getElementById('cursor-image');
    const cursorVideo = document.getElementById('cursor-video');
    
    let intervaloSlideshow; 

    // A. Mover cursor
    const moverCursor = (e) => {
        const x = e.clientX + 'px';
        const y = e.clientY + 'px';
        if(cursorImg) { cursorImg.style.left = x; cursorImg.style.top = y; }
        if(cursorVideo) { cursorVideo.style.left = x; cursorVideo.style.top = y; }
    };
    document.addEventListener('mousemove', moverCursor);

    // B. Lógica hover
    magicWords.forEach(word => {
        word.addEventListener('mouseenter', () => {
            const dataContent = word.getAttribute('data-img');
            if (!dataContent) return;

            const sources = dataContent.split(',').map(url => url.trim());
            const primerArchivo = sources[0];
            const esVideo = primerArchivo.toLowerCase().includes('.mp4');

            if (esVideo) {
                if(cursorVideo) {
                    cursorVideo.src = primerArchivo;
                    cursorVideo.classList.add('visible');
                    cursorVideo.muted = true; 
                    cursorVideo.play().catch(e => console.log("Error play:", e));
                }
                if(cursorImg) cursorImg.classList.remove('visible');
            } else {
                if(cursorImg && sources.length > 0) {
                    let indiceActual = 0;
                    cursorImg.src = sources[0];
                    cursorImg.classList.add('visible');
                    
                    if(cursorVideo) {
                        cursorVideo.classList.remove('visible');
                        cursorVideo.pause();
                    }
                    if (sources.length > 1) {
                        intervaloSlideshow = setInterval(() => {
                            indiceActual = (indiceActual + 1) % sources.length;
                            cursorImg.src = sources[indiceActual];
                        }, 800);
                    }
                }
            }
        });

        word.addEventListener('mouseleave', () => {
            if(cursorImg) cursorImg.classList.remove('visible');
            if(cursorVideo) {
                cursorVideo.classList.remove('visible');
                cursorVideo.pause();
            }
            clearInterval(intervaloSlideshow);
        });
    });

    /* =========================================
       4. CONTROL DE AUDIO & COPY EMAIL
       ========================================= */
    const videosGaleria = document.querySelectorAll('video');
    videosGaleria.forEach(video => {
        video.addEventListener('click', () => {
            if(video.id === 'cursor-video') return;
            if (video.muted) {
                video.muted = false; video.volume = 1;
            } else {
                video.muted = true;
            }
        });
    });

    const emailLinks = document.querySelectorAll('.copy-email');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = "benitez.barbara05@gmail.com";
            navigator.clipboard.writeText(email).then(() => {
                const textoOriginal = link.innerText;
                link.innerText = "¡Copiado! ✅";
                link.style.color = "#00c853";
                setTimeout(() => {
                    link.innerText = textoOriginal;
                    link.style.color = "";
                }, 2000);
            });
        });
    });
});