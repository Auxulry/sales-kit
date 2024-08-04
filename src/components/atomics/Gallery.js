import React from 'react';
import { Grid } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import Image from 'next/image';

const totalImages = 9;

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const imagePaths = Array.from({ length: totalImages }, (_, index) => ({
  id: index + 1,
  image: `/images/galleries/Gallery-${index + 1}.jpg`,
}));

function Gallery() {
  const chunks = chunkArray(imagePaths, 3);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Swiper
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          loop
        >
          {chunks.map((chunk, chunkIndex) => (
            <SwiperSlide key={chunkIndex}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '360px' }}>
                {chunk.map((item) => (
                  <div key={item.id} style={{ width: '33.33%', position: 'relative', height: '100%' }}>
                    <Image
                      src={item.image}
                      alt={`Gallery Image ${item.id}`}
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Grid>
  );
}

export default Gallery;
