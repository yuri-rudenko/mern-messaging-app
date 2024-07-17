export default function scrollToBottom() {

    let scrollIterations = 0;

    scrollLocal()

    function scrollLocal() {

        let messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            if (scrollIterations < 10) {
                setTimeout(scrollLocal, 10);
                scrollIterations++;
            }
        }
        
    }

}