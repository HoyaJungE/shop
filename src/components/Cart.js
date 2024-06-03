import { Table } from 'react-bootstrap';
import {useDispatch, useSelector} from "react-redux";
import {changeName, increase} from "../store/userSlice.js";
import {increaseCount, decreaseCount} from "../store.js";


function Cart(){

    let state = useSelector((state) => state );
    let dispatch = useDispatch();

    return (
        <div>
            {state.user.name} ({state.user.age}) 의 장바구니
            <button onClick={()=>{dispatch(increase(100))}}> age+</button>
            <Table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>상품명</th>
                    <th>수량</th>
                    <th>변경하기</th>
                </tr>
                </thead>
                <tbody>
                {
                    state.cart.map((element, i) =>{
                        return(
                            <tr key={i}>
                                <td>{element.id}</td>
                                <td>{element.name}</td>
                                <td>{element.count}</td>
                                <td>{element.name}</td>
                                <td>
                                    <button onClick={()=>{
                                        dispatch(increaseCount(element.id));
                                    }}>+</button>
                                </td>
                                <td>
                                    <button onClick={()=>{
                                        dispatch(decreaseCount(element.id));
                                    }}>-</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
        </div>
    );
}

export default Cart;