import React, { useState } from 'react';

const Image = ({ singleImage, setAllChecked, allchecked, index }) => {

    //All local state ---------------------------------
    const [checkboxDispaly, setChecboxDisplay] = useState(false);
    const [isSelected, setIsSelected] = useState(false);



    // handle selected and not selected ---------------
    const handleCheck = (e) => {
        if (e.target.checked) {
            setAllChecked([...allchecked, e.target.value])

        } else {
            setAllChecked(allchecked.filter((singleImageCheck) => singleImageCheck !== e.target.value))
        }
        setIsSelected(!isSelected)
    }

    //checkbox functionality will show or not ---------
    const handleMouseEnter = () => {
        setChecboxDisplay(true);

    }
    const handleMouseLeave = () => {
        if (!isSelected) {
            setChecboxDisplay(false);
        }
    }

    //overlay css---------------------------------------
    const overlayStyle = {
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: checkboxDispaly ? 'block' : 'none',
    };


    return (
        <div className='relative' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <div>
                <img src={singleImage.img} alt="images" className='h-46 w-30 object-contain' />
            </div>
            <div style={overlayStyle}>
                {/* Checkbox */}
                {checkboxDispaly && <input type="checkbox" value={singleImage._id} className="checkbox rounded block absolute m-1 bg-white " checked={isSelected} onChange={handleCheck} />
                }
            </div>
        </div>
    )
};

export default Image;