import { useEffect } from 'react';

/**
 * Хук для прокрутки к элементу по ID, указанному в хэше URL
 */
export function useHashScroll() {
    useEffect(() => {
        const handleHashScroll = () => {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '');

                // Функция попытки скролла
                const attemptScroll = (attempts = 0) => {
                    const element = document.getElementById(id);
                    if (element) {
                        // Небольшая задержка, чтобы убедиться, что элементы выше заняли свое место
                        setTimeout(() => {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    } else if (attempts < 10) {
                        // Если элемента еще нет, пробуем снова через 100мс
                        setTimeout(() => attemptScroll(attempts + 1), 100);
                    }
                };

                attemptScroll();
            }
        };

        // Запускаем при монтировании
        setTimeout(handleHashScroll, 300);
        setTimeout(handleHashScroll, 1500); // Резервная попытка после полной загрузки страницы

        // Слушаем изменения хэша
        window.addEventListener('hashchange', handleHashScroll);
        return () => window.removeEventListener('hashchange', handleHashScroll);
    }, []);
}
