import { useState, useEffect } from 'react';
import axios from 'axios';

const PriceDisplay = ({ token }: { token: string }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get(`/api/get-prices?token=${token}`);
        if (response.data.success) {
          setPrice(response.data.price);
        } else {
          setError('Unable to fetch price');
        }
      } catch (error) {
        setError('Error fetching price');
        console.error(error);
      }
    };

    fetchPrice();
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  if (price === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{token} Price</h2>
      <p>${price}</p>
    </div>
  );
};

export default PriceDisplay;
