import { createContext, useContext, useReducer } from 'react';

// Preparing the data layer
export const StateContext = createContext();

// Wrap the app and provide the data layer to all components
export const StateProvider = ({reducer, initialState, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);