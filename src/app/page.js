"use client"
import React, { useEffect, useState } from 'react';
import config from '@/config';
import Image from 'next/image';

const Home = () => {
  const [featureProducts, setFeatureProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchProducts = async (filter) => {
          const reqOptions = {
            Headers: {
              Authorization: `Bearer ${process.env.API_KEY}`
            }
          }
          const request = await fetch(`${config.api}/api/products?populate=*&${filter}`, reqOptions);
          const response = await request.json();
          return response.data;
        }

        const featureProductsData = await fetchProducts('filter[IsFeatured][$eq]=true');
        const otherProductsData = await fetchProducts('filter[IsFeatured][$eq]=false');
        
        setFeatureProducts(featureProductsData);
        setOtherProducts(otherProductsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div>
      {error && (
        <div>
          <p>Error fetching products. Please try again later.</p>
        </div>
      )}
      <div>
        {/* Render feature products */}
        {featureProducts.map((item, index) => (
          <div key={index}>
            <div>{item.attributes.title}</div>
            <div>{item.attributes.description}</div>
            <div>{item.attributes.price}</div>
            {/* Render the image if present */}
            <div className='aspect-square'>

              {item.attributes.banner && (
                <Image src={item?.attributes?.banner?.data.attributes?.url} alt="hello"  height={250} width={250} style={{objectFit:'cover'}}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
