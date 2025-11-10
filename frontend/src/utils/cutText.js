
   export const cutText = (text, long) => {

        if(!text || typeof text !== "string") {
            return ''
        }

        if(text.length > long) {
           return  text.slice( 0, long ) + '...'
        }
        return text
    }