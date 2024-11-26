// app/components/ConfigSuccess.tsx
'use client';

import DataDisplay from "../_components/DataDispaly";

const ConfigSuccess = () => {
    return <DataDisplay sessionStorageKey="configData" title="Device Configuration" />;
};

export default ConfigSuccess;
