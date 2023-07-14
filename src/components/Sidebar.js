import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const tabs = [
    {
        index: 0,
        title: "My Order",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c5.131 0 9-1.935 9-4.5V7h-.053c.033-.164.053-.33.053-.5C21 3.935 17.131 2 12 2C7.209 2 3.52 3.688 3.053 6H3v11.5c0 2.565 3.869 4.5 9 4.5zm0-2c-4.273 0-7-1.48-7-2.5V9.394C6.623 10.387 9.111 11 12 11s5.377-.613 7-1.606V17.5c0 1.02-2.727 2.5-7 2.5zm0-16c4.273 0 7 1.48 7 2.5S16.273 9 12 9S5 7.52 5 6.5S7.727 4 12 4z" /></svg>,
        href: '/my-order'
    },
    {
        index: 2,
        title: "Log Out",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m2 12l5 4v-3h9v-2H7V8z" /><path fill="currentColor" d="M13.001 2.999a8.938 8.938 0 0 0-6.364 2.637L8.051 7.05c1.322-1.322 3.08-2.051 4.95-2.051s3.628.729 4.95 2.051s2.051 3.08 2.051 4.95s-.729 3.628-2.051 4.95s-3.08 2.051-4.95 2.051s-3.628-.729-4.95-2.051l-1.414 1.414c1.699 1.7 3.959 2.637 6.364 2.637s4.665-.937 6.364-2.637c1.7-1.699 2.637-3.959 2.637-6.364s-.937-4.665-2.637-6.364a8.938 8.938 0 0 0-6.364-2.637z" /></svg>,
        href: '/logout'
    },
]

const Sidebar = () => {
    const { logout, isLoggedIn } = useContext(AuthContext);
    const [tab, setActiveTab] = useState(0);
    const [indicatorPositionY, setIndicatorPosition] = useState(0);
    const [isShow, setShow] = useState(true);
    useEffect(() => {
        const currentUrl = window.location.href;
        const route = currentUrl.split('/')[currentUrl.split('/').length - 1];
        // alert(route);
        // alert(tabs.map(_tab=>_tab.href).indexOf('/'+route))
        if(tabs.map(_tab=>_tab.href).indexOf('/'+route) < 0){
            console.log(route);
            console.log(tabs.map(_tab=>_tab.href).indexOf('/'+route));
            setShow(()=>false)
            if(route !== 'signup' && route !== "login"){
                window.location.href = "/login"
            }
            return;
        }
        setShow(()=>true);
        const _tab = tabs.filter(_tab_ => _tab_.href === '/' + route)[0];
        if (_tab.index !== tab)
            setActiveTab(_tab_ => _tab ? _tab.index : 0);
    }, [])
    useEffect(()=>{
        if(isLoggedIn){
            setShow(()=>true)
        }
    },[isLoggedIn])
    useEffect(() => {
        console.log({ tab });
        setIndicatorPosition(60 * tab);
    }, [tab])

    const handleClick = (index) => {
        setActiveTab(index);
        console.log(index);
        if(index === 1){
            logout();
        }
    }
    return (
        <>{
            isShow && (
                <div className="sidebar">
                    <div className='sidebar__logo'>Order Books</div>
                    <div className="flex-column sidebar__menu">
                        <div className="sidebar__menu__indicator" style={{ transform: "translateX(-50%) translateY(" + indicatorPositionY + "px)", height: "60px" }}></div>

                        {tabs.map((_tab, index) => (
                            <Link key={index} to={_tab.href} onClick={(e) => { handleClick(index) }}>
                                <div className="sidebar__menu__item">
                                    <div className="sidebar__menu__item__icon">
                                        {_tab.svg}
                                    </div>
                                    <div className="sidebar__menu__item__text">
                                        {_tab.title}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        }</>

    );
};

export default Sidebar;
