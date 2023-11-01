import React from 'react';
import Image from './Image';
import { useForm } from 'react-hook-form';

const Images = () => {

    const { register, handleSubmit } = useForm();
    const imageStorageKey = '1d685d0dc62621d6524a698642b092eb';

    const onSubmit = async data => {
        const image = data.image[0];
        const formData = new FormData();
        formData.append("image", image)
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result=>{
                if(result.success){
                    const uploadImageUrl = result.data.url;
                    const imageUrl = {img: uploadImageUrl}
                }
                
            })
            

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="file" {...register("image", { required: true })} className='input input-bordered' />
        </form>
    );
};

export default Images;