import React from 'react';
import './BoundingBox.css';

const BoundingBox = ({boxes}) => 
{
    return (
        <div>
            {
            boxes.map((box, i) => {
                    return (
                    <div className='bounding-box' 
                         key={i}
                         style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}
                    >
                    </div>);
                }
              )
            }
        </div>
    );
};

export default BoundingBox;