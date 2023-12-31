import React, { useEffect, useState } from 'react';
import Image from './Image';
import { useForm } from 'react-hook-form';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useQuery } from 'react-query';

const Images = () => {

    // Local state -----------------------------------------------
    const [allchecked, setAllChecked] = useState([]);
    const [allImages, setAllImages] = useState([]);


    //load all gallery images -------------------------------------
    const fetchData = async () => {
        const response = await fetch('https://image-gallery-server-ten.vercel.app/allImage')
        if (!response.ok) {
            throw new Error("Network error")
        }
        return response.json();
    }

    //used react use query library -------------------------------
    const { data, isLoading, refetch } = useQuery("Images", fetchData);


    useEffect(() => {
        //reloading the page set value at localstorage and get values -------
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


    // useform for getting image file ---------------------------
    const { register, handleSubmit, reset } = useForm();
    const imageStorageKey = '1d685d0dc62621d6524a698642b092eb';


    //handleDragEnd function -------------------------------------
    const handleDragEnd = (result) => {
        if (!result?.destination) return
        const tasks = [...allImages]
        const [reorderedItem] = tasks.splice(result.source.index, 1)
        tasks.splice(result.destination.index, 0, reorderedItem)

        const idsOrderArray = tasks.map(task => task._id)
        localStorage.setItem('imageOrder', JSON.stringify(idsOrderArray))

        setAllImages(tasks)
    }


    // for uploading image to imgbb server -----------------------
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

                    // after successfully upload in imgbb server 
                    // pass the imagurl to monogdb server
                    fetch('https://image-gallery-server-ten.vercel.app/addImageUrl', {
                        method: 'POST',
                        headers: {
                            "content-type": "application/json",
                        },
                        body: JSON.stringify(imageUrl)
                    })
                        .then(res => res.json())
                        .then(inserted => {
                            console.log('inserted')
                            reset()
                            refetch()
                        })
                }
            })
    }

    //for deleting all image from server---------------------------------------------
    const handleDelete = () => {

        // localstorage part ---------------------------
        const arrayIdsOrder = JSON.parse(localStorage.getItem("imageOrder"));
        if (arrayIdsOrder?.length) {
            const newIdsOrderArray = arrayIdsOrder.filter(num => !allchecked.includes(num))
            localStorage.setItem('imageOrder', JSON.stringify(newIdsOrderArray))
        }

        // delete from serverr --------------------------
        fetch('https://image-gallery-server-ten.vercel.app/deleteImages', {
            method: 'DELETE',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(allchecked)
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Successfully deleteted")
                    refetch()
                }
                else {
                    console.error(response.status)
                }
            })

    }

    // Loading showing --------------------
    if (isLoading) {
        return <p>Loading ...</p>
    }

    console.log(allImages)
    return (
        <div>
            <div className='flex justify-between'>
                {/* selected item number */}
                <p className='text-xl pt-5 pl-5'>{allchecked.length} item selected</p>

                {/* Delete all button */}
                <button className="btn btn-warning m-5 order-last" onClick={handleDelete}>All Delete</button>

            </div>
            <div >
                {/* Images display section */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='images'>
                        {(provided) => (
                            <section {...provided.droppableProps} ref={provided.innerRef}>
                                <div className='grid grid-flow-row grid-cols-3 md:grid-cols-4 gap-4'>
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
                <div className='mt-5'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="file" {...register("image", { required: true })} className='input input-bordered ' />
                        <input type="submit" className='btn' value="add" />
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Images;