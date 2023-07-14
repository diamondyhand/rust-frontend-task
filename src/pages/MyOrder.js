
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
// import { CustomerService } from './service/CustomerService';

const _orders = [
    {
        id: 1,
        price: 30,
        quantity: 6,
        side: 'bid',
    },
    {
        id: 2,
        price: 35,
        quantity: 2,
        side: 'ask',
    },
    {
        id: 3,
        price: 38,
        quantity: 3,
        side: 'bid',
    },
    {
        id: 4,
        price: 24,
        quantity: 8,
        side: 'ask',
    }
]
const MyOrder = () => {
    const { isLoggedIn, userId } = useContext(AuthContext);

    
    const [selectedOrders, setSelectedOrders] = useState([]);

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        price: 0,
        quantity: 0,
        side: 'bid',
    })

    const navigate = useNavigate()

    const [side, setSide] = useState('all')
    const [loading, setLoading] = useState(false);
    const [isShow, setShow] = useState(false);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const toast = useRef(null);

    useEffect(() => {
        console.log({isLoggedIn, userId});
        if (!isLoggedIn && userId < 0) {
            navigate('/login')
        }
        getOrders();
    }, [isLoggedIn, userId])

    useEffect(() => {
        if (side === 'all') {
            setFilteredOrders(() => orders);
        } else if (side === "bid") {
            setFilteredOrders(() => orders.filter(_order => _order.side === 'bid'));
        } else {
            setFilteredOrders(() => orders.filter(_order => _order.side === 'ask'));
        }
    }, [orders, side])

    const getOrders = async () => {
        // setOrders(() => _orders);

        const res = await axios.get(REACT_APP_API_URL + '/api/orders');
        console.log({ res });
        if (res && res.data && res.data.body && res.data.body.Orders.length > 0 && res.status === 200) {
            setOrders(() => [...res.data.body.Orders])
            setFilteredOrders(() => [...res.data.body.Orders]);
        }
    }

    const onRowSelect = (event) => {
        setSelectedOrders(_orders => [..._orders, event.data]);
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: `Order ID: ${event.data.id}`, life: 1000 });
    };

    const onRowUnselect = (event) => {
        setSelectedOrders(_orders => _orders.filter(item => item.id !== event.data.id));

        toast.current.show({ severity: 'warn', summary: 'Product Unselected', detail: `Order ID: ${event.data.id}`, life: 1000 });
    };



    const actionOrderTemplate = (rowData, options) => {
        return <button className='btn btn-danger rounded-pill  create_order fs-6' onClick={(e) => deleteOrderClickHandle(rowData)}>Delete an Order</button>
    }

    const deleteOrderClickHandle = async (rowData) => {
        //console.log(1);
        const res = await axios.get(REACT_APP_API_URL + `/api/orders/delete/${rowData.id}`);
        console.log(res);
        if (res && res.status === 200) {
            setSelectedOrders(_orders => _orders.filter(_order => _order.id !== rowData.id))
            setOrders(_orders => _orders.filter(_order => _order.id !== rowData.id))
        }
    }

    const newOrderClickHandle = async () => {
        console.log(newOrder);
        const res = await axios.post(REACT_APP_API_URL + "/api/orders/new_order", { 
            price: Number(newOrder.price),
            quantity: Number(newOrder.quantity),
            side: newOrder.side,
            user_id: 1,
        });
        console.log(res);
        if (res && res.data && res.data.body && res.data.body.Order) {
            setOrders(_orders => [..._orders, res.data.body.Order])
        }
    }

    const handleSideSelectHandle = (value) => {
        setSide(()=> value);
    }
    const handleClickSelectedDelete = () => {
        console.log({ selectedOrders });
    }

    const handleNewOrderElementChange = (e) => {
        setNewOrder(_newOrder => ({
            ..._newOrder,
            [e.target.name]: e.target.value
        }))
    }
    const hanldeCreateClick = () => {
        setShow(_isShow=>!_isShow)
    }
    return (
        <div className="card bg-transparent">
            <Toast ref={toast} />
            <div className='row p-5 bg-transparent' >
                <div className='col-lg-5 col-md-3 col-sm-12 bg-transparent'>
                    {selectedOrders.length > 0 && (
                        <button
                            className='btn btn-danger rounded-pill  create_order fs-6'
                            onClick={() => handleClickSelectedDelete()}
                        >
                            Delete selected Orders
                        </button>
                    )}
                </div>
                <div className='col-lg-4 col-md-4 col-sm-12 d-flex align-items-center justify-content-center flex-column'>
                    <div className="input-group">
                        <div className="input-group-text">
                            Side:
                        </div>
                        <select className="form-select" value={side} onChange={(e) => handleSideSelectHandle(e.target.value)}>
                            <option value="all">ALL</option>
                            <option value="bid">BID</option>
                            <option value="ask">ASK</option>
                        </select>
                    </div>

                </div>
                <div className='col-lg-3 col-md-3 col-sm-12'>
                    <div className='d-flex justify-content-end'>
                        <button 
                            className={isShow ? 'btn btn-danger rounded-pill create_order' : 'btn btn-success rounded-pill create_order'} onClick={(e) => hanldeCreateClick()}>{isShow ? "Cancel" : "New Order"}</button>

                    </div>
                </div>

            </div>
            {
                isShow && (
                    <div className='row p-5 bg-transparent' >
                        <div className='col-lg-3 col-md-3 col-sm-12 bg-transparent'>
                            <div className="input-group">
                                <div className="input-group-text">
                                    Price:
                                </div>
                                <input
                                    className="form-control"
                                    type='number'
                                    min={0}
                                    name="price"
                                    value={newOrder.price}
                                    onChange={(e) => handleNewOrderElementChange(e)}
                                />

                            </div>
                        </div>
                        <div className='col-lg-3 col-md-4 col-sm-12 d-flex align-items-center justify-content-center flex-column'>
                            <div className="input-group">
                                <div className="input-group-text">
                                    Quantity:
                                </div>
                                <input
                                    className="form-control"
                                    type='number'
                                    min={0}
                                    name="quantity"
                                    value={newOrder.quantity}
                                    onChange={(e) => handleNewOrderElementChange(e)}
                                />
                            </div>

                        </div>
                        <div className='col-lg-3 col-md-4 col-sm-12 d-flex align-items-center justify-content-center flex-column'>
                            <div className="input-group">
                                <div className="input-group-text">
                                    Side:
                                </div>
                                <select 
                                    className="form-select" 
                                    name="side"
                                    value={newOrder.side}
                                    onChange={(e) => handleNewOrderElementChange(e)}
                                >
                                    <option value="bid">BID</option>
                                    <option value="ask">ASK</option>
                                </select>
                            </div>

                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-12'>
                            <div className='d-flex justify-content-end'>
                                <button 
                                    className={
                                        loading ? 
                                            'btn btn-success rounded-pill create_order disabled' : 
                                            'btn btn-success rounded-pill create_order'} 
                                    onClick={(e) => newOrderClickHandle()}>{loading ? <Spinner /> : "Create an Order"}</button>

                            </div>
                        </div>

                    </div>

                )
            }
            <div className='row p-5'>
                <div className='col-lg-12 col-md-12 col-sm-12 bg-transparent'>
                    <div className="pool__box__title">My Bid/Ask Orders</div>
                    <DataTable
                        value={filteredOrders}
                        paginator rows={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        selectionMode="single"
                        selection={selectedOrders}
                        dataKey="id"
                        onRowSelect={onRowSelect}
                        onRowUnselect={onRowUnselect}
                        sortField="id"
                        sortOrder={1}
                        metaKeySelection={false}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        paginatorLeft={paginatorLeft}
                        paginatorRight={paginatorRight}
                        className='border border-1 rounded-pill'>
                        <Column field="id" header="Order ID" sortable />
                        <Column field="price" header="Price" sortable />
                        <Column field="quantity" header="Quantity" sortable />
                        <Column field="side" header="Aggregate Pool Name" sortable />
                        <Column header="Action" body={actionOrderTemplate} />
                    </DataTable>
                </div>
            </div>

        </div >
    );
}

export default MyOrder;

