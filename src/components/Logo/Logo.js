import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => 
{
    return (
        <Tilt className='Tilt br2 shadow-2'>
            <div className='pa3'>
                <img style={{paddingTop: '5px'}} src={brain} alt='Brain Logo'/>
            </div>
        </Tilt>
    );
}

export default Logo;