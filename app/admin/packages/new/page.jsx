'use client';

import { Suspense } from 'react';
import PackageForm from '../../../components/PackageForm';

export default function NewPackagePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-gray-400">Loading form...</div>}>
      <PackageForm />
    </Suspense>
  );
}
