'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast';

const notify = () => toast('Here is your toast.');


// Define types for response and config
interface Config {
  // Define the properties based on your API response
  fiscalDayNo: number;
  status: string;
  // Add other fields as needed
}

interface FDMSResponse {
  // Define the properties based on your FDMS API response
  success: boolean;
  message: string;
  // Add other fields as needed
}

export default function Home() {
  const [response, setResponse] = useState<FDMSResponse | null>(null);
  const [config, setConfig] = useState<Config | null>(null);

  const openFiscalDay = async () => {
    const res = await fetch('/api/fiscal/open-day', {
      method: 'POST',
    });
    const data = await res.json();
    setConfig(data.data);
  };

  const closeFiscalDay = async () => {
    await fetch('/api/fiscal/close-day', {
      method: 'POST',
    });
  };

  const sendRequest = async () => {
    const res = await fetch('/api/fdms-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field1: 'example',
        field2: 123,
      }),
    });

    const data = await res.json();
    setResponse(data);
  };

  const sendReceipt = async () => {
    await fetch('/api/fiscal/send-receipt', {
      method: 'POST',
      body: JSON.stringify({
        field1: 'Example Item',
        field2: 100,
      }),
    });
  };


  return (
    <div className='p-8'>
      <h1>Fiscal Device Dashboard</h1>
      <div className="flex flex-col gap-4 w-[120px] my-4">
        <Button onClick={openFiscalDay}>Open Fiscal Day</Button>
        <Button onClick={closeFiscalDay}>Close Fiscal Day</Button>
        <Button onClick={sendReceipt}>Send Receipt</Button>
        {config && <pre>{JSON.stringify(config, null, 2)}</pre>}
      </div>
      <div className=""></div>
      <h1 className='pb-4'>FDMS Request</h1>
      <Button onClick={sendRequest}>Send Request</Button>
      {response && (
        <div className='my-8'>
          <h2 className='text-lg font-bold'>Response</h2>
          <pre className='border p-4 rounded mt-4 text-red-700'>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      <button onClick={notify}>Make me a toast</button>
    </div>
  );
}
