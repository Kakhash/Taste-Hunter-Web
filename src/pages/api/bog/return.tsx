// pages/[bank]/return.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ReturnPage = () => {
  const router = useRouter();
  const { status, order_id } = router.query;

  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    if (status === 'success') {
      setMessage('🎉 Payment successful! Thank you for your order.');
      // Optionally call your backend to confirm and store the order
      // Clear local cart if you're using localStorage or global state
    } else if (status === 'fail') {
      setMessage('❌ Payment failed. Please try again.');
    } else {
      setMessage('⚠️ Unknown payment status.');
    }
  }, [status]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{message}</h1>
      {order_id && <p>Order ID: {order_id}</p>}
    </div>
  );
};

export default ReturnPage;