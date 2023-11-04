import React, { useEffect, useState } from 'react';
import Image from './Image';
import { useForm } from 'react-hook-form';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useQuery } from 'react-query';

const Images = () => {

    const [allchecked, setAllChecked] = useState([]);
    const [allImages, setAllImages] = useState([]);


    //load all gallery images
    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/images')
        if (!response.ok) {
            throw new Error("Network error")
        }
        return response.json();
    }
    const { data, isLoading } = useQuery("Images", fetchData);

    useEffect(() => {
        
        //reloading the page set value at localstorage and get values
        const arrayIdOrder = JSON.parse(localStorage.getItem('imageOrder'));
        if (!arrayIdOrder && data?.length) {
            const idsOrderArray = data.map(task => task._id)
            localStorage.setItem('imageOrder', JSON.stringify(idsOrderArray))
        }

        let myArray;
        if (arrayIdOrder?.length && data?.length) {
            myArray = arrayIdOrder.map(position => {
                return data.find(el => el._id === position)
            })

            const newItems = data.filter(el => {
                return !arrayIdOrder.includes(el._id)
            })

            if (newItems?.length) myArray = [...newItems, ...myArray]
        }

        setAllImages(myArray || data)
    }, [data])


    // useform for getting image file
    const { register, handleSubmit, reset } = useForm();
    const imageStorageKey = '1d685d0dc62621d6524a698642b092eb';


    //handleDragEnd function
    const handleDragEnd = (result) => {
        if (!result) return
        const tasks = [...allImages]
        const [reorderedItem] = tasks.splice(result.source.index, 1)
        tasks.splice(result.destination.index, 0, reorderedItem)

        const idsOrderArray = tasks.map(task => task._id)
        localStorage.setItem('imageOrder', JSON.stringify(idsOrderArray))

        setAllImages(tasks)
    }


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
                console.log(result)
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

    if (isLoading) {
        return <p>Loading ...</p>
    }


    return (
        <div>
            {/* selected item number */}
            <p className='text-xl'>{allchecked.length} item selected</p>

            {/* Delete all button */}
            <button className="btn btn-warning m-5">All Delete</button>

            {/* Images display section */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='images'>
                    {(provided) => (
                        <section {...provided.droppableProps} ref={provided.innerRef}>
                            <div className='grid grid-flow-row grid-cols-3 gap-4 '>
                                {
                                    allImages?.map((singleImage, index) => {
                                        return (
                                            <Draggable key={singleImage._id} draggableId={singleImage._id} index={index}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                                                        <Image singleImage={singleImage} setAllChecked={setAllChecked} allchecked={allchecked} key={index} index={index} ></Image>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    }
                                    )
                                }
                            </div>
                            {provided.placeholder}
                        </section>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Image upload section */}
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="file" {...register("image", { required: true })} className='input input-bordered' />
                    <input type="submit" className='btn' value="add" />
                </form>
            </div>
        </div >
    );
};

export default Images;