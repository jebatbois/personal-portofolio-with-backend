// src/public-components/icons/ArrowIcon.js
import React from 'react';
import { useTheme } from '@mui/material/styles';

const ArrowIcon = (props) => {
  const theme = useTheme(); // Mengambil tema kita

  return (
    // Kita gunakan {...props} agar bisa menambahkan styling dari luar
    <svg
      width="135"
      height="27"
      viewBox="0 0 135 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M133.156 12.1537C133.461 12.8312 133.159 13.6273 132.481 13.9319L121.441 18.8954C120.763 19.1999 119.967 18.8976 119.662 18.2201C119.358 17.5426 119.66 16.7465 120.338 16.4419L130.151 12.03L125.74 2.21607C125.435 1.53856 125.737 0.742418 126.415 0.437837C127.092 0.133256 127.888 0.435572 128.193 1.11308L133.156 12.1537ZM131.452 13.9626C108.883 5.39262 51.2522 -4.28865 1.69313 25.5569L0.305371 23.2525C50.8205 -7.16882 109.387 2.70623 132.407 11.4478L131.452 13.9626Z"
        // Menggunakan warna 'secondary' dari tema kita
        fill={theme.palette.secondary.main}
      />
    </svg>
  );
};

export default ArrowIcon;