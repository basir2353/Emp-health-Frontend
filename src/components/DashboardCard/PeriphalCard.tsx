import React, { useState } from 'react';
import { Button, Card, Empty, Modal, message } from 'antd';
import Peripheral from '../../public/images/peripheral.svg';

interface ConnectedDevice {
  name: string;
  id: string;
}

const PeripheralCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectedDevice, setConnectedDevice] = useState<ConnectedDevice | null>(null);

  const handleConnect = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleBluetoothConnect = async () => {
    try {
      setLoading(true);
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });

      if (!device.gatt) {
        throw new Error('GATT server is not available on this device.');
      }
      await device.gatt.connect();
      setConnectedDevice({ name: device.name || 'Unknown Device', id: device.id || 'Unknown ID' });
      message.success(`Connected to ${device.name}`, 2);
      setIsModalOpen(false);
    } catch (error) {
      message.error('Failed to connect to Bluetooth device');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="w-full max-w-xl mx-auto mr-8">
  <Card bordered={false} className="w-[610px] h-[426px] max-lg:w-auto shadow-lg">
    <div className="text-neutral-400 text-2xl font-normal leading-loose pl-3 mb-2">
      Peripheral Data
    </div>

    {connectedDevice ? (
      <div className="text-center mt-4 animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-green-600 font-medium">Device Connected</span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-lg font-semibold text-gray-800">{connectedDevice.name}</p>
          <p className="text-sm text-gray-500 mb-4">ID: {connectedDevice.id}</p>

          {/* Example health data */}
          <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-600">
            <div>
              <span className="font-semibold">Heart Rate:</span> 72 bpm
            </div>
            <div>
              <span className="font-semibold">Battery:</span> 85%
            </div>
            <div>
              <span className="font-semibold">Status:</span> Active
            </div>
            <div>
              <span className="font-semibold">Last Sync:</span> 2 mins ago
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <Button type="default">
              Disconnect
            </Button>
            <Button type="primary"  style={{ backgroundColor: 'black', color: 'white' }}>
              Sync Now
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <Empty
        image={Peripheral}
        imageStyle={{
          height: 187,
          width: 187,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '14px',
        }}
        description={
          <span>
            No Devices are connected to the system. Please connect the device to see your health data.
          </span>
        }
      >
        <Button type="primary" onClick={handleConnect} style={{ backgroundColor: 'black', color: 'white' }}>
          Connect Device
        </Button>
      </Empty>
    )}
  </Card>

  <Modal title="Connect Your Device" open={isModalOpen} onCancel={handleCloseModal} footer={null}>
    <p>Ensure your Bluetooth is enabled and select your device below.</p>
    <Button type="primary" onClick={handleBluetoothConnect} loading={loading} style={{ width: '100%' }}>
      Connect via Bluetooth
    </Button>
  </Modal>
</div>

  );
};

export default PeripheralCard;
