import scrollToBottom from "./scrollToBottom";

export default function handleImagesAndScroll(setLoading) {
    
    if(setLoading) setLoading(true);
    const images = document.querySelectorAll('.messages-container img');
    let imagesLoaded = 0;
    let timeoutId;

    const handleImageLoad = () => {
        imagesLoaded += 1;
        if (imagesLoaded === images.length) {
            clearTimeout(timeoutId);
            scrollToBottom();
            if(setLoading) setLoading(false);
        }
    };

    const timeoutFunction = () => {
        images.forEach(image => {
            image.removeEventListener('load', handleImageLoad);
        });
        scrollToBottom();
        if(setLoading) setLoading(false);
    };

    timeoutId = setTimeout(timeoutFunction, 5000);

    if (images.length === 0) {
        clearTimeout(timeoutId);
        scrollToBottom();
        if(setLoading) setLoading(false);
    } else {
        images.forEach(image => {
            if (image.complete) {
                handleImageLoad();
            } else {
                image.addEventListener('load', handleImageLoad);
            }
        });
    }

    return () => {
        clearTimeout(timeoutId);
        images.forEach(image => {
            image.removeEventListener('load', handleImageLoad);
        });
    };
};