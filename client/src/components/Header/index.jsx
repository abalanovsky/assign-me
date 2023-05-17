import React from 'react';
import './Header.css'
import {useDispatch, useSelector} from "react-redux";
import {Button, Tooltip} from "antd";
import {LogoutOutlined} from '@ant-design/icons';
import {unsetCurrUser} from "../../redux/redux";
import {ReactComponent as Logo} from '../../assets/AssignMeLogo.svg';

function Header() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const handleSignOut = () => {
        dispatch(unsetCurrUser())
    }
    return (
        <div className="header-container">
            <div className="header-logo-text"><Logo width="150px"/></div>
            { user._id !== null && <div className="header-info">
                <span className="header-hi-text">Hi, {user.name}</span>
                <Tooltip title="Sign out">
                    <Button shape="circle" type="primary" icon={<LogoutOutlined />} onClick={handleSignOut}/>
                </Tooltip>
            </div> }
        </div>
    );
}

export default Header;
