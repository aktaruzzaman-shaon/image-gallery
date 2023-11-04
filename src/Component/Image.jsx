import React, { useState } from 'react';

const Image = ({ singleImage, setAllChecked, allchecked, index }) => {

    //All local state
    const [selectImageIndex, setselectImageIndex] = useState();
    const [dropPositionImageIndex, setDropPositionImageIndex] = useState();
    const [checkboxDispaly, setChecboxDisplay] = useState(false)
 
    // handle handleCheck
    const handleCheck = (e) => {
        if (e.target.checked) {
            setAllChecked([...allchecked, e.target.value])
        } else {
            setAllChecked(allchecked.filter((singleImageCheck) => singleImageCheck !== e.target.value))
        }
    }

    return (
        <div className='group relative  items-center justify-center overflow-hidden 'onMouseEnter={() => setChecboxDisplay(true)} onMouseLeave={() => setChecboxDisplay(false)} >

            {checkboxDispaly && <input type="checkbox" value={singleImage._id} className="checkbox rounded block absolute m-1 bg-white" onChange={handleCheck} />
            }

            <div >
                <img src={singleImage.img} alt="" className='h-46 w-30 object-contain' />
            </div>
        </div>
    )
};

export default Image;