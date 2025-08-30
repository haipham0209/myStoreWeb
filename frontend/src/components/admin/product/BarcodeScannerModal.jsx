import React, { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from '@zxing/library';

const BarcodeScannerModal = ({ show, onClose, onScanSuccess }) => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    if (!show) return;

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        // Lấy camera sau nếu có, nếu không thì lấy camera đầu tiên
        const backCamera = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back')
        ) || videoInputDevices[0];

        if (videoRef.current && backCamera) {
          codeReader.current.decodeFromVideoDevice(
            backCamera.deviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                onScanSuccess(result.getText());
                stopScanner();
              }
              // Có thể xử lý lỗi scan nếu cần (err)
            }
          );
        }
      })
      .catch(err => console.error(err));

    return () => {
      stopScanner();
    };
  }, [show]);

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Barcode Scan</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                stopScanner();
                onClose();
              }}
            />
          </div>
          <div className="modal-body">
            <video
              ref={videoRef}
              style={{ width: '100%' }}
              muted
              playsInline
              autoPlay
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
