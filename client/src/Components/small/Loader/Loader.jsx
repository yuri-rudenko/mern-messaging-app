import React from 'react';
import './loader.css';

const Loader = ({absolute}) => {
    return (
        <div className={absolute ? "loader-parent" : "loader-parent-relative "}>
            <div className={absolute ? "lds-facebook absolute" : "lds-facebook relative"}><div></div><div></div><div></div></div>
        </div>
    );
}

export default Loader;
