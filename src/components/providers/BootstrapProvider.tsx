'use client';

import { useEffect } from 'react';

export default function BootstrapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Import Bootstrap CSS on the client side
    require('bootstrap/dist/css/bootstrap.min.css');
  }, []);

  return <>{children}</>;
} 