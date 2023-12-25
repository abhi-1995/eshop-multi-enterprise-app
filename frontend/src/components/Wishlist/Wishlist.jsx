import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import {BsCartPlus} from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

const Wishlist = ({ setOpenWishlist }) => {
  const cartData = [
    {
      name: "IPhone 14 pro max 256gb ssd and 8gb ram silver color",
      description: "test",
      price: 999,
    },
    {
      name: "IPhone 14 pro max 256gb ssd and 8gb ram silver color",
      description: "test2",
      price: 222,
    },
    {
      name: "IPhone 14 pro max 256gb ssd and 8gb ram silver color",
      description: "test3",
      price: 555,
    },
  ];
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setOpenWishlist(false)}
            />
          </div>
          {/** Item length */}
          <div className={`${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">3 items</h5>
          </div>

          {/** cart single items */}
          <div className="w-full border-t">
            {cartData &&
              cartData.map((i, index) => <CartSingle key={index} data={i} />)}
          </div>
        </div>

      </div>
    </div>
  );
};

const CartSingle = ({ data }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1 className="cursor-pointer"/>
        <img src="https://www.91-img.com/gallery_images_uploads/1/5/15e9ca2e0a917a4323c32370a95492c00192eb53.jpg" alt="" 
        className="w-[80px] h-[80px] ml-2"
        />
        
        <div className="pl-[5px]">
            <h1>{data.name}</h1>
            <h4 className="font-[600] text-[17px] pt-[13px] text-[#d02222] font-Roboto">
                US ${totalPrice}
            </h4>
        </div>
        <div>
            <BsCartPlus size={20} className="cursor-pointer" title="Add to cart"/>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
