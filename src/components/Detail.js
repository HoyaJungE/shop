import {useParams} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {useEffect, useState} from "react";
import {addCart} from "../store.js";
import {useDispatch, useSelector} from "react-redux";

function Detail(props){
    let {id} = useParams();
    let 찾은상품 = props.shoes.find((x) => {return x.id==id});
    let [탭, 탭변경] = useState(0);
    let [fade, setFade] = useState('');
    let state = useSelector((state) => state );
    let dispatch = useDispatch();

    useEffect(()=>{
        let a = setTimeout(()=>{setFade('end')}, 200);
        return ()=>{
            clearTimeout(a);
            setFade('');
        };
    }, [탭])

    return (
        <div className={'container start ' + fade}>
            <div className="row">
                <div className="col-md-6">
                    <img src={"https://codingapple1.github.io/shop/shoes"+ (parseInt(id)+1) +".jpg"} width="100%" />
                </div>
                <div className="col-md-6">
                    <h4 className="pt-5">{찾은상품.title}</h4>
                    <p>{찾은상품.content}</p>
                    <p>{찾은상품.price}원</p>
                    <button className="btn btn-danger" onClick={ ()=>{ dispatch(addCart(찾은상품)); console.log(state) } }>주문하기</button>
                </div>
            </div>

            <Nav variant="tabs"  defaultActiveKey={탭}>
                <Nav.Item>
                    <Nav.Link eventKey="0" onClick={()=>{탭변경(0)}}>버튼0</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="1" onClick={()=>{탭변경(1)}}>버튼1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="2" onClick={()=>{탭변경(2)}}>버튼2</Nav.Link>
                </Nav.Item>
            </Nav>
            <TabContent 탭={탭} shoes={props.shoes}/>
        </div>
    )
}

function TabContent({탭, shoes}){
    let [fade, setFade] = useState('');
    
    useEffect(()=>{
        let a = setTimeout(()=>{setFade('end')}, 100);
        return ()=>{
            clearTimeout(a);
            setFade('');
        };
    }, [탭])

    return (
        <div className={`start ${fade}`}>
            { [<div>{shoes[0].title}</div>, <div>내용1</div>, <div>내용2</div>][탭] }
        </div>
    )

}
export default Detail;