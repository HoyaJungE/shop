import {configureStore, createSlice} from '@reduxjs/toolkit'
import user from './store/userSlice.js';

let stock = createSlice({
    name : 'stock',
    initialState : [10,11,12]
})

let cart = createSlice({
    name : 'cart',
    initialState : [
        {id : 0, name : 'White and Black', count : 2},
        {id : 2, name : 'Grey Yordan', count : 1}
    ],
    reducers : {
        increaseCount(state, a){
            state.find((x)=>x.id === a.payload).count++;
        },
        decreaseCount(state, a){
            let index = state.findIndex((x)=>x.id === a.payload);
            if(state[index].count > 1){
                state[index].count--;
            } else {
                state.splice(index, 1);
            }
        },
        addCart(state, a){
            let index = state.findIndex((x)=>x.id === a.payload.id);
            if(index !== -1){
                state[index].count++;
            }else{
                state.push({id : a.payload.id, name : a.payload.title, count : 1});
                state.sort((a,b) => (a.id - b.id));
            }
        }
    }
})

export let { increaseCount, decreaseCount, addCart } = cart.actions;

export default configureStore({
    reducer: {
        user : user.reducer,
        stock : stock.reducer,
        cart : cart.reducer
    }
})