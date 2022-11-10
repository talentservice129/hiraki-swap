import { createContext, useReducer } from "react";
import { AppReducer } from './AppReducer'

const initialState = {
    account: null, 
    web3Provider: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const delAccount = () => {
        dispatch({
            type: 'DELETE_ACCOUNT'
        })
    }

    const addAccount = (account) => {
        dispatch({
            type: 'ADD_ACCOUNT',
            payload: account.id
        })
    }

    const updateProvider = (provider) => {
        dispatch({
            type: 'UPDATE_PROVIDER',
            payload: provider
        })
    }

    // const updateOwnedNFTs = (nfts) => {
    //     dispatch({
    //         type: "UPDATE_NFTS", 
    //         payload: nfts
    //     })
    // }

    // const fetchWalletNFTs = async (account) => {
    //     try {
    //         if(account) {
    //             const endpoint = process.env.REACT_APP_ALCHEMY_ENDPOINT
    //             const nfts = await fetch(`${endpoint}/getNFTs/?owner=${account}&contractAddresses[]=${CONFIG.NFT_CONTRACT}` ,{
    //                 method: 'GET', 
    //                 redirect: 'follow'
    //             })
    //             const response = await nfts.json();
    //             updateOwnedNFTs(response)
    //         }
          
    //     } catch(e) {
    //         console.log(e)
    //     }
    // }

    return (
        <GlobalContext.Provider value={
            {
                ...state,
                delAccount, 
                addAccount,
                updateProvider            
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}