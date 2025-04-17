import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
    const [image, setImage] = useState(null); // ✅ Initialize as null
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        cafeteriaId: '' // ✅ Cafeteria selection
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log("Updated Data:", { ...data, [name]: value }); // ✅ Debugging
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Please upload an image');
            return;
        }

        if (!data.cafeteriaId) {
            toast.error('Please select a cafeteria');
            return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', Number(data.price));
        formData.append('category', data.category);
        formData.append('image', image);
        formData.append('cafeteriaId', data.cafeteriaId);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: '',
                    description: '',
                    price: '',
                    category: 'Main Course',
                    cafeteriaId: ''
                });
                setImage(null);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error adding food:', error);
            toast.error('Error adding food item');
        }
    };

    return (
        <div className="content">
            <div className="add">
                <form className="flex-col" onSubmit={onSubmitHandler}>
                    <div className="add-img-upload flex-col">
                        <p>Upload Image</p>
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload Preview" />
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                    </div>

                    <div className="add-product-name flex-col">
                        <p>Product Name</p>
                        <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Type here" />
                    </div>

                    <div className="add-product-description flex-col">
                        <p>Product Description</p>
                        <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required></textarea>
                    </div>

                    <div className="add-category-price">
                        <div className="add-category flex-col">
                            <p>Product Category</p>
                            <select onChange={onChangeHandler} name="category" value={data.category}>
                                <option value="Main Course">Main Course</option>
                                <option value="Tandoori">Tandoori</option>
                                <option value="Continental">Continental</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Indian Snacks">Indian Snacks</option>
                                <option value="Chinese">Chinese</option>
                                <option value="South Indian">South Indian</option>
                            </select>
                        </div>

                        <div className="add-price flex-col">
                            <p>Product Price</p>
                            <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder="₹20" />
                        </div>
                    </div>

                    {/* ✅ Hardcoded Cafeteria Selection */}
                    <div className="add-category flex-col">
                        <p>Select Cafeteria</p>
                        <select onChange={onChangeHandler} name="cafeteriaId" value={data.cafeteriaId} required>
                            <option value="">-- Select Cafeteria --</option>
                            <option value="mblock">mblock</option>
                            <option value="ubblock">ubblock</option>
                        </select>
                    </div>

                    <button type="submit" className="add-btn">ADD</button>
                </form>
            </div>
        </div>
    );
};

export default Add;
