// app/components/ConfigStatus.tsx
'use client';

import DataDisplay from "../_components/DataDispaly";


const ConfigStatus = () => {
    return <DataDisplay sessionStorageKey="statusData" title="Device Status" />;
};

export default ConfigStatus;
