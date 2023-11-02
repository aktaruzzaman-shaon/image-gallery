import React from 'react';

const Image = ({ singleImage, setAllChecked, allchecked }) => {

    // handle handleCheck
    const handleCheck = (e) => {
        if (e.target.checked) {
            setAllChecked([...allchecked, e.target.value])
        } else {
            setAllChecked(allchecked.filter((singleImageCheck) => singleImageCheck !== e.target.value))
        }
    }

    return (
        <div className='group relative cursor-pointer items-center justify-center overflow-hidden '>
            <div>
                <img src={singleImage.img} alt="" className='h-46 w-30 object-contain ' />
            </div>
            <div class="absolute inset-1 flex translate-y-[110%] flex-col  transition-all duration-500 group-hover:translate-y-0">
                {/* checkbox for select image */}
                <input type="checkbox" value={singleImage._id} className="checkbox rounded block" onChange={handleCheck} />
            </div>
        </div>
    );
};

export default Image;