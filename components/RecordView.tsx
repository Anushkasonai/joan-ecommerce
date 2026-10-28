'use client';

import { useEffect } from 'react';

export default function RecordView({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('joan_recently_viewed');
      let ids: string[] = stored ? JSON.parse(stored) : [];
      ids = [productId, ...ids.filter((id) => id !== productId)].slice(0, 8);
      localStorage.setItem('joan_recently_viewed', JSON.stringify(ids));
    } catch (e) {
      // ignore
    }
  }, [productId]);

  return null;
}

