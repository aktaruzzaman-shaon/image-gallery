import React, { useEffect, useState } from 'react';
import Image from './Image';
import { useForm } from 'react-hook-form';

const Images = () => {

    const [allImages, setAllImages] = useState([])

    //load all gallery images
    useEffect(() => {
        fetch('http://localhost:5000/images')
            .then(res => res.json())
            .then(data => setAllImages(data))
    }, [allImages])

    // useform for getting image file
    const { register, handleSubmit, reset } = useForm();
    const imageStorageKey = '1d685d0dc62621d6524a698642b092eb';

    // for uploading image to imgbb server 
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
            .then(result => {
                if (result.success) {
                    const uploadImageUrl = result.data.url;
                    const imageUrl = { img: uploadImageUrl }

                    // after successfully upload in imgbb server pass the imagurl to monogdb server
                    fetch('http://localhost:5000/addImageUrl', {
                        method: 'POST',
                        headers: {
                            "content-type": "application/json",
                            authorization: 'bearer'
                        },
                        body: JSON.stringify(imageUrl)
                    })
                        .then(res => res.json())
                        .then(inserted => {
                            console.log('inserted')
                            reset()
                        })
                }
            })
    }

    return (
        <div>
            <div className='grid grid-flow-row grid-cols-3 gap-4  '>
                {
                    allImages.map((singleImage, index) => <Image singleImage={singleImage} key={index}></Image>)
                }
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("image", { required: true })} className='input input-bordered' />
                <input type="submit" className='btn' value="add" />
            </form>
        </div>
    );
};

export default Images;