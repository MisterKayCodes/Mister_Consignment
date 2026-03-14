import { useState } from 'react';
import { shipmentApi } from '../api/shipments';

export const useShipment = () => {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackShipment = async (trackingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await shipmentApi.getShipment(trackingId);
      setShipment(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Shipment not found');
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  return { shipment, loading, error, trackShipment };
};
