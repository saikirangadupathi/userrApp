import React, { useRef, useEffect, useState  } from 'react';

const OrderStatus = ({ orderStatus }) => {
    const progress1 = useRef(0);
    const progress2 = useRef(0);
    const progress3 = useRef(0);
    const progress4 = useRef(0);

    const [tooltip, setTooltip] = useState('');
    const [hoveredStep, setHoveredStep] = useState(null);

    const stepLabels = ['Order Placed', 'Processing', 'In Progress', 'Shipped', 'Delivered'];

    let selectedStep = 0;

    switch (orderStatus) {
        case 'orderplaced':
            selectedStep = 1;
            break;
        case 'processing':
            selectedStep = 2;
            break;
        case 'in progress':
            selectedStep = 3;
            break;
        case 'shipped':
            selectedStep = 4;
            break;
        case 'delivered':
            selectedStep = 5;
            break;
        case 'cancelled':
            selectedStep = 6;
            break;
        default:
            selectedStep = 0;
    }

    useEffect(() => {
        if (selectedStep > 0) {
            progress1.current = 100;
        }
        if (selectedStep > 1) {
            progress2.current = 100;
        }
        if (selectedStep > 2) {
            progress3.current = 100;
        }
        if (selectedStep > 3) {
            progress4.current = 100;
        }
       
        if (selectedStep > 0) {
            setTooltip(stepLabels[selectedStep - 1]);
            setHoveredStep(selectedStep);

            
            const timer = setTimeout(() => {
                setTooltip('');
                setHoveredStep(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [selectedStep]);

    
    const handleMouseEnter = (step) => {
        if (step <= selectedStep) { // Only show tooltip for green stepsep - 1]);
            setHoveredStep(step);
        }
    };

    const handleMouseLeave = () => {
        setTooltip('');
        setHoveredStep(null);
    };

    const stepStyle = (step) => ({
        width: '4vw',
        height: '2vh',
        borderRadius: '50%',
        backgroundColor: selectedStep >= step ? 'green' : '#a9a9a9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '3vw',
        lineHeight: '1',
        position: 'relative',
    });

    const progressBarStyle = (step) => ({
        width: '0.5vh', 
        height: '4vh', 
        backgroundColor: selectedStep >= step ? 'green' : '#a9a9a9',
    });

    return (
    <div style={{ height: '30vh', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2vh', position: 'relative' }}>
                <div
                    onMouseEnter={() => handleMouseEnter(1)}
                    onMouseLeave={handleMouseLeave}
                    style={stepStyle(1)}
                >
                    ⊚
                    {hoveredStep === 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '4vw',
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                padding: '1vw 2vw',
                                borderRadius: '5px',
                                fontSize: '3vw',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltip}
                        </div>
                    )}
                </div>
                {/* Progress Bar between 1 and 2 */}
                <div style={progressBarStyle(2)}></div>

                {/* Step 2 */}
                <div
                    onMouseEnter={() => handleMouseEnter(2)}
                    onMouseLeave={handleMouseLeave}
                    style={stepStyle(2)}
                >
                    ⊚
                    {hoveredStep === 2 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '2vw', // Position beside the step
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                fontSize: '2vw',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltip}
                        </div>
                    )}
                </div>
                {/* Progress Bar between 2 and 3 */}
                <div style={progressBarStyle(3)}></div>

                {/* Step 3 */}
                <div
                    onMouseEnter={() => handleMouseEnter(3)}
                    onMouseLeave={handleMouseLeave}
                    style={stepStyle(3)}
                >
                    ⊚
                    {hoveredStep === 3 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '5vw', // Position beside the step
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                fontSize: '2vw',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltip}
                        </div>
                    )}
                </div>
                {/* Progress Bar between 3 and 4 */}
                <div style={progressBarStyle(4)}></div>

                {/* Step 4 */}
                <div
                    onMouseEnter={() => handleMouseEnter(4)}
                    onMouseLeave={handleMouseLeave}
                    style={stepStyle(4)}
                >
                    ⊚
                    {hoveredStep === 4 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '5vw', // Position beside the step
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                fontSize: '2vw',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltip}
                        </div>
                    )}
                </div>
                {/* Progress Bar between 4 and 5 */}
                <div style={progressBarStyle(5)}></div>

                {/* Step 5 */}
                <div
                    onMouseEnter={() => handleMouseEnter(5)}
                    onMouseLeave={handleMouseLeave}
                    style={stepStyle(5)}
                >
                    ⊚
                    {hoveredStep === 5 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '5vw', // Position beside the step
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                color: '#fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                fontSize: '2vw',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {tooltip}
                        </div>
                    )}
                </div>
        </div>
    </div>
    );
};

export default OrderStatus;
