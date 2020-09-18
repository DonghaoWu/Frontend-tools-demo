import { createContext } from 'react';

const DisplayNameContext = createContext({
    displayName:'',
    setName:()=>{}
});

export default DisplayNameContext;