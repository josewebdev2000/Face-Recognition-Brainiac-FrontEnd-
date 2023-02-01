import React from 'react';
import BoundingBox from '../BoundingBox/BoundingBox';

const FaceRecognition = ({ imageUrl, boxes, boxesReady }) => 
{
    if (boxes.length > 0 && boxesReady)
    {
        return (
            <div className='center'>
                <div className='absolute mt2'>
                    <img src={imageUrl} id='inputImage' alt={''} width={'500px'} height={'auto'}/>
                    <BoundingBox boxes={boxes}/>
                </div>
            </div>  
                    
        );
    }

    else if (boxes.length === 0 && boxesReady)
    {
        return (
            <div className='center'>
                <div className='absolute mt2'>
                    <img src={imageUrl} id='inputImage' alt={''} width={'500px'} height={'auto'}/>
                </div>
            </div>  
                    
        );
    }

    else
    {
        return(
            <div>
            </div>
        );
    }
}

export default FaceRecognition;