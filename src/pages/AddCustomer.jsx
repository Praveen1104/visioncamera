import React, { useState } from "react";
import Personal from "../components/customer/Personal";
import VisionX from "../components/customer/VisionX";
import Camera from "../components/customer/Camera";

const AddCustomer = () => {
  const [step, setStep] = useState(1);
  const steps = ["Personal", "VisionX", "Camera"];

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  return (
    <div className="mt-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center">
          {steps.map((stepLabel, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex-1 text-center ${
                  index + 1 <= step ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 mx-auto rounded-full bg-[--input-bg-color] border-2 border-[--border-color] flex items-center justify-center">
                    <span
                      className={`text-sm font-bold ${
                        index + 1 <= step ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="mt-2 text-xs">{stepLabel}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                    index + 1 < step ? "border-blue-600" : "border-[--border-color]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && <Personal handleNext={handleNext} />}

        {step === 2 && (
          <VisionX handleNext={handleNext} handlePrevious={handlePrevious} />
        )}

        {step === 3 && <Camera handlePrevious={handlePrevious} />}
      </div>
    </div>
  );
};

export default AddCustomer;
