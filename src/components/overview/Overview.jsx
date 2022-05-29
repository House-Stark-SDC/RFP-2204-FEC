import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from './ImageGallery';
import ExpandedView from './ExpandedView';
import DescriptionDetails from './DescriptionDetails';
import sampleProductData from './example_data/productData';
import sampleProductStylesData from './example_data/productStylesData';
import sampleProductReviewsData from './example_data/productReviewsData';
import config from '../../../config/config';

export default function Overview() {
  const [isDefaultImgView, setIsDefaultImgView] = useState(true);
  const [currImgIdx, setCurrImgIdx] = useState(0);
  const [currStyle, setCurrStyle] = useState(0);
  const [skuData, setSkuData] = useState({
    'Select Size': {
      quantity: '-',
      size: 'Select Size...',
    },
  });
  const [productID, setProductID] = useState(40344);
  const [productData, setProductData] = useState(sampleProductData);
  const [productStylesData, setProductStylesData] = useState(
    sampleProductStylesData
  );
  const [productReviewsData, setProductReviewsData] = useState(
    sampleProductReviewsData
  );
  const [isLoaded, setIsLoaded] = useState({
    product: false,
    styles: false,
    reviews: false,
  });

  const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/';
  useEffect(() => {
    setIsLoaded({
      product: false,
      styles: false,
      reviews: false,
    });
    axios
      .get(`${url}products/${productID}`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((res) => {
        setProductData(res.data);
        setIsLoaded((prev) => ({
          ...prev,
          product: true,
        }));
      });

    axios
      .get(`${url}products/${productID}/styles`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((res) => {
        setProductStylesData(res.data);
        setIsLoaded((prev) => ({
          ...prev,
          styles: true,
        }));
      });

    axios
      .get(`${url}reviews/meta?product_id=${productID}`, {
        headers: { Authorization: config.TOKEN },
      })
      .then((res) => {
        setProductReviewsData(res.data);
        setIsLoaded((prev) => ({
          ...prev,
          reviews: true,
        }));
      });
  }, [productID]);

  useEffect(() => {
    setSkuData({
      ...productStylesData.results[currStyle].skus,
      'Select Size': {
        quantity: '-',
        size: 'Select Size...',
      },
    });
  }, [currStyle, productStylesData]);

  let avgRating = 0;
  const reviewCount = Object.keys(productReviewsData.ratings).reduce(
    (aggCount, key) => {
      const currCount = Number(productReviewsData.ratings[key]);
      avgRating += currCount * Number(key);
      return aggCount + currCount;
    },
    0
  );
  avgRating /= reviewCount;

  const styles = productStylesData.results.map((style) => ({
    styleId: style.style_id,
    iconUrl: style.photos[0].thumbnail_url,
  }));

  const incrementIdx = () => {
    setCurrImgIdx((prev) => prev + 1);
  };

  const decrementIdx = () => {
    setCurrImgIdx((prev) => prev - 1);
  };

  const changeImgView = () => {
    setIsDefaultImgView((prev) => {
      if (prev) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'initial';
      }
      return !prev;
    });
  };

  const currPrice = Number(productStylesData.results[currStyle].original_price);

  const currSalePrice =
    productStylesData.results[currStyle].sale_price === null
      ? 0
      : Number(productStylesData.results[currStyle].sale_price);

  return isDefaultImgView ? (
    isLoaded.product === true &&
      isLoaded.styles === true &&
      isLoaded.reviews === true && (
        <section
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            maxWidth: '100vw',
          }}
        >
          <ImageGallery
            changeImgView={changeImgView}
            photos={productStylesData.results[currStyle].photos}
            currImgIdx={currImgIdx}
            incrementIdx={incrementIdx}
            decrementIdx={decrementIdx}
            setCurrImgIdx={setCurrImgIdx}
          />
          <DescriptionDetails
            category={productData.category}
            name={productData.name}
            description={productData.description}
            slogan={productData.slogan}
            styles={styles}
            currStyle={currStyle}
            setCurrStyle={setCurrStyle}
            currPrice={currPrice}
            currSalePrice={currSalePrice}
            reviewCount={reviewCount}
            avgRating={avgRating}
            skuData={skuData}
          />
        </section>
      )
  ) : (
    <ExpandedView
      changeImgView={changeImgView}
      currPhotoUrl={productStylesData.results[currStyle].photos[currImgIdx].url}
      photos={productStylesData.results[currStyle].photos}
      currImgIdx={currImgIdx}
      setCurrImgIdx={setCurrImgIdx}
    />
  );
}
