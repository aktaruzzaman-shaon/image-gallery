import React from 'react';

const Image = ({ singleImage }) => {
    
    return (
        <div className='group relative cursor-pointer items-center justify-center overflow-hidden '>
            <div>
                <img src={singleImage.img} alt="" className='h-46 w-30 object-contain ' />
            </div>
            <div class="absolute inset-1 flex translate-y-[110%] flex-col  transition-all duration-500 group-hover:translate-y-0">
                <input type="checkbox" className="checkbox rounded red" onChange={handleCheck} />
            </div>
        </div>
    );
};

export default Image;